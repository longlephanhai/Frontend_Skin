import * as faceapi from 'face-api.js';

export const checkFacePose = async (
    imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    expectedSide: FaceDirection
): Promise<CheckPoseResult> => {

    const detection = await faceapi.detectSingleFace(imageElement)
        .withFaceLandmarks();

    if (!detection) {
        return { valid: false, message: "Không tìm thấy khuôn mặt trong ảnh" };
    }

    const landmarks = detection.landmarks;

    const nose: faceapi.Point = landmarks.getNose()[0];
    const jaw: faceapi.Point[] = landmarks.getJawOutline();


    const leftFaceEdge = jaw[0];
    const rightFaceEdge = jaw[16];

    const distLeft = nose.x - leftFaceEdge.x;
    const distRight = rightFaceEdge.x - nose.x;

    if (distRight === 0) return { valid: false, message: "Góc mặt quá lệch, vui lòng thử lại" };

    const ratio = distLeft / distRight;


    switch (expectedSide) {
        case 'front':
            if (ratio > 0.6 && ratio < 1.4) return { valid: true };
            return { valid: false, message: "Vui lòng nhìn thẳng vào camera" };

        case 'left':
            if (ratio < 0.5) return { valid: true };
            return { valid: false, message: "Vui lòng xoay mặt sang trái" };

        case 'right':
            if (ratio > 1.8) return { valid: true };
            return { valid: false, message: "Vui lòng xoay mặt sang phải" };

        default:
            return { valid: false, message: "Hướng mặt không xác định" };
    }
};