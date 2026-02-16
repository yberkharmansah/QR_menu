from pathlib import Path
from urllib.parse import quote_plus
from urllib.request import urlopen


INSTAGRAM_URL = "https://www.instagram.com/cremorecoffee/"
MAPS_URL = "https://maps.app.goo.gl/JLmKKqqZGSRHe8r7A"
QR_SIZE = "900x900"


def download_qr(target_path: Path, data_url: str) -> None:
    encoded = quote_plus(data_url)
    source = f"https://api.qrserver.com/v1/create-qr-code/?size={QR_SIZE}&data={encoded}&format=png"
    with urlopen(source) as resp:
        payload = resp.read()
    target_path.write_bytes(payload)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    exports_dir = root / "exports"
    exports_dir.mkdir(parents=True, exist_ok=True)

    insta_path = exports_dir / "instagram-qr.png"
    maps_path = exports_dir / "maps-qr.png"

    download_qr(insta_path, INSTAGRAM_URL)
    download_qr(maps_path, MAPS_URL)

    print(f"created: {insta_path}")
    print(f"created: {maps_path}")


if __name__ == "__main__":
    main()
