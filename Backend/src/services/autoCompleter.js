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

      // 1. Dapatkan rental berstatus 'active' yang end_date-nya kurang dari hari ini
      const { data: expiredRentals, error: selectError } = await supabase
        .from('rentals')
        .select('id, end_date, car_id')
        .eq('status', 'active')
        .lt('end_date', todayStr);

      if (selectError) {
        console.error('[Auto-Completer ERROR] Gagal mengambil data rental kedaluwarsa:', selectError.message);
        return;
      }

      if (expiredRentals && expiredRentals.length > 0) {
        const idsToUpdate = expiredRentals.map(r => r.id);
        console.log(`[Auto-Completer] Menemukan ${expiredRentals.length} rental aktif yang telah kedaluwarsa:`, expiredRentals);

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
