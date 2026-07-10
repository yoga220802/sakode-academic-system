# FE-SLICE-009 — Admin Student Registration Review Report (Manual Payment & Receipt Verification)

## 1. Scope and Accomplishments
Enhanced the **Admin Student Registration Review Workspace** to support manual transfer receipt simulation, installment payment tracing, group payment mode choices (merged vs. individual), and verification:

- **Group Payment Modes (Opsi Pembayaran Kelompok)**:
  - Added an interactive **"Mode Pembayaran Kelompok"** tab switcher for group registrations (`REG-004`).
  - Supports two payment paths:
    1. **Transfer Satuan (Individual Transfer)**: Displays a split payment list showing each member's details (Charles Go, Dendi Kurniawan, Eka Prasetya), individual share (Rp 250.000), payment status, and verification receipt. Enables individual simulation upload triggers.
    2. **Transfer Kolektif (Merged Payment)**: Reverts to a single group-wide receipt view for the total package price (Rp 750.000).
- **Installment Payment Tracing (Pembayaran Dicicil)**:
  - Added a dedicated "Termin Pembayaran Cicilan" card inside the registration details sidebar for students using installment plans (`REG-002`, `REG-005`).
  - Renders a clean vertical schedule showing term name (e.g. DP 40%, Termin 2 30%, Pelunasan 30%), due dates, installment amounts, status badges, and action buttons.
  - Tracking operates per-installment: each installment has its own simulated receipt file name, date, and verification status.
  - Once all installments are fully verified and paid, the system automatically flags the main `paymentConfirmed` status as active.
- **Proof of Payment Section**:
  - Implemented a "Bukti Pembayaran / Transfer" details block in the registration sidebar panel (`/registration-review`).
  - Displays the receipt file name and upload timestamp if present.
- **Simulated Receipt Upload**:
  - If a student has not uploaded their payment receipt yet, the Admin can click the "Simulasikan Upload Bukti Transfer" or "Simulasikan Bayar" button.
  - Automatically generates a simulated filename (e.g. `bukti_transfer_charles_go_bca.jpg`), records the upload timestamp, appends the action to the registration timeline, and updates the local state.
- **Interactive Bank Receipt Viewer Modal**:
  - Added a "Lihat Bukti" button to trigger the receipt modal popup.
  - Features a high-fidelity mobile banking e-receipt layout displaying BCA/Mandiri letterheads, transaction status (SUCCESS / TRANSAKSI BERHASIL), source bank account name, destination bank account name/number (SAKODE ACADEMY INDONESIA), correct final payment amount, and a deterministic reference number.
- **Compile & Lint Verification**: Completed build (`npm run build`) and lint (`npm run lint`) checks successfully with **0 errors and 0 warnings** in modified workspace paths.

---

## 2. Files Modified / Created
*   [page.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/registration-review/page.tsx) — Main registration review page with upload simulation, dynamic installments, group payments, and custom receipt viewer.

---

## 3. Reviewer Checklist
### Group Payments
1. [ ] Navigate to **Review Pendaftaran** in the sidebar.
2. [ ] Select **Kelompok Belajar Figma (3 Anak)** (REG-004) in the list:
   * Verify the **"Mode Pembayaran Kelompok"** selector card is rendered.
   * **Transfer Satuan** mode:
     * Check if *Charles Go* and *Eka Prasetya* are marked "Lunas" (Rp 250.000). Click **Lihat Bukti** to verify individual e-receipts and amounts.
     * Check if *Dendi Kurniawan* is marked "Belum Bayar". Click **Simulasikan Bayar** for Dendi. Verify the toast notification, timeline update, and e-receipt.
     * Once all 3 members are paid, verify that the main group activation checks are ready.
   * **Transfer Kolektif** mode:
     * Toggle to "Transfer Kolektif". Verify the list switches to a single collective "Bukti Pembayaran / Transfer" display showing total cost (Rp 750.000).
