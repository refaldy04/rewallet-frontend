import { Brand, Icon } from "./ui";
export default function ProductPreview() {
  return (
    <div
      className="product-preview"
      aria-label="Pratinjau tampilan rewallet dengan data contoh"
    >
      <Brand />
      <div className="preview-balance">
        <span>Saldo tersedia · contoh</span>
        <strong>Rp4.250.000</strong>
        <div className="preview-actions">
          <span>↗ &nbsp; Transfer</span>
          <span>＋ &nbsp; Isi saldo</span>
        </div>
      </div>
      <div className="preview-activity">
        <h3>Aktivitas terbaru</h3>
        <div className="preview-row">
          <span>
            <Icon name="transfer" />
          </span>
          <div>
            <b>Nadia Putri</b>
            <small>Makan siang · 10.24 WIB</small>
          </div>
          <strong>−Rp150.000</strong>
        </div>
        <div className="preview-row">
          <span>
            <Icon name="topup" />
          </span>
          <div>
            <b>Isi saldo</b>
            <small>Dompet personal · 08.10 WIB</small>
          </div>
          <strong className="positive">+Rp1.000.000</strong>
        </div>
      </div>
    </div>
  );
}
