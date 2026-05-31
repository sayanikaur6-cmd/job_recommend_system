import cv2
from PIL import Image

def preprocess_image(image_path: str):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    processed_path = image_path.replace(".png", "_processed.png")
    cv2.imwrite(processed_path, thresh)

    return Image.open(processed_path)