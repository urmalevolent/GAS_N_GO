import { supabaseAdmin } from '../../config/supabase.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Server belum dikonfigurasi untuk fungsi ini (Service Role Key tidak ada).' });
    }

    // 1. Total Registered Accounts
    const { count: usersCount, error: errUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');
    if (errUsers) throw errUsers;

    // 2. Total Cars
    const { count: carsCount, error: errCars } = await supabaseAdmin
      .from('cars')
      .select('*', { count: 'exact', head: true });
    if (errCars) throw errCars;

    // 3. Total Transactions
    const { count: transactionsCount, error: errTrans } = await supabaseAdmin
      .from('rentals')
      .select('*', { count: 'exact', head: true });
    if (errTrans) throw errTrans;

    // 4. Calculate Total Revenue & Chart Data (Last 7 Days)
    // Supabase JS doesn't have advanced grouping, so we fetch recent payments and group in JS
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: payments, error: errPay } = await supabaseAdmin
      .from('rental_payments')
      .select('total_price, created_at, payment_status')
      .gte('created_at', sevenDaysAgo.toISOString());
    if (errPay) throw errPay;

    let totalRevenue = 0;
    
    // Siapkan wadah 7 hari terakhir
    const chartLabels = [];
    const chartData = [];
    const revenueByDay = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      chartLabels.push(label);
      revenueByDay[label] = 0;
    }

    payments.forEach(p => {
      // Kita hanya hitung yang sukses
      if (p.payment_status === 'verified' || p.payment_status === 'settlement' || p.payment_status === 'capture') {
        totalRevenue += (p.total_price || 0);
        
        const pDate = new Date(p.created_at);
        const label = pDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        if (revenueByDay[label] !== undefined) {
          revenueByDay[label] += (p.total_price || 0);
        }
      }
    });

    for (let i = 0; i < chartLabels.length; i++) {
      chartData.push(revenueByDay[chartLabels[i]]);
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          accounts: usersCount || 0,
          cars: carsCount || 0,
          transactions: transactionsCount || 0,
          revenue: totalRevenue || 0
        },
        chart: {
          labels: chartLabels,
          data: chartData
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
