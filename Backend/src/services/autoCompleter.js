import { supabase } from '../config/supabase.js';

/**
 * Memeriksa dan memperbarui status rental aktif secara otomatis menjadi selesai (completed)
 * jika hari sewa berakhir (end_date kurang dari hari ini).
 */
export const startRentalAutoCompleter = () => {
  const checkAndComplete = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      console.log(`[Auto-Completer] Memeriksa rental aktif yang masa sewanya berakhir sebelum tanggal: ${todayStr}...`);

      // 1. Dapatkan rental berstatus 'active' beserta pickup_time di rental_details
      const { data: activeRentals, error: selectError } = await supabase
        .from('rentals')
        .select('id, end_date, car_id, rental_details(pickup_time)')
        .eq('status', 'active');

      if (selectError) {
        console.error('[Auto-Completer ERROR] Gagal mengambil data rental aktif:', selectError.message);
        return;
      }

      const idsToUpdate = [];
      if (activeRentals && activeRentals.length > 0) {
        for (const rental of activeRentals) {
          const details = rental.rental_details?.[0];
          if (details && details.pickup_time) {
            // Combine end_date with time portion of pickup_time
            const timePart = details.pickup_time.split('T')[1];
            const returnDate = new Date(`${rental.end_date}T${timePart}`);
            
            if (today >= returnDate) {
              idsToUpdate.push(rental.id);
            }
          } else {
            // Fallback: If no pickup_time (still in delivery), check if end_date has passed
            if (rental.end_date < todayStr) {
              idsToUpdate.push(rental.id);
            }
          }
        }
      }

      if (idsToUpdate.length > 0) {
        console.log(`[Auto-Completer] Menemukan ${idsToUpdate.length} rental yang telah selesai:`, idsToUpdate);

        // 2. Update status rental menjadi 'completed'
        const { error: updateError } = await supabase
          .from('rentals')
          .update({ status: 'completed' })
          .in('id', idsToUpdate);

        if (updateError) {
          console.error('[Auto-Completer ERROR] Gagal memperbarui status rental ke completed:', updateError.message);
        } else {
          console.log(`[Auto-Completer SUCCESS] Berhasil memperbarui status rental ke completed untuk ID:`, idsToUpdate);
        }
      }
    } catch (err) {
      console.error('[Auto-Completer ERROR] Terjadi kesalahan tak terduga:', err);
    }
  };

  // Jalankan pemeriksaan pertama kali saat server startup
  setTimeout(checkAndComplete, 3000); // Tunda 3 detik agar startup server selesai dengan tenang

  // Jalankan pemeriksaan secara periodik setiap 1 menit (60.000 ms)
  setInterval(checkAndComplete, 60000);
};
