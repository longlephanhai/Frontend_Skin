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

export const skinConditionInfo: Record<string, {
    title: string,
    definition: string,
    cause: string,
    advice: string,
    link: string
}> = {
    'Acne': {
        title: 'Mụn viêm',
        definition: 'Các nốt đỏ, sưng tấy trên da, có thể gây đau.',
        cause: 'Vi khuẩn P. acnes phát triển trong lỗ chân lông bị tắc.',
        advice: 'Sử dụng chấm mụn chứa Benzoyl Peroxide hoặc tràm trà.',
        link: 'https://www.healthline.com/health/skin/inflammatory-acne'
    },
    'Blackheads': {
        title: 'Mụn đầu đen',
        definition: 'Lỗ chân lông bị tắc nghẽn hở miệng, bị oxy hóa.',
        cause: 'Bã nhờn và tế bào chết tích tụ lâu ngày.',
        advice: 'Sử dụng BHA (Salicylic Acid) để làm sạch sâu.',
        link: 'https://www.mayoclinic.org/diseases-conditions/acne/symptoms-causes/syc-20368047'
    },
    'Whiteheads': {
        title: 'Mụn đầu trắng',
        definition: 'Mụn nhân đóng, nằm dưới lớp biểu bì da.',
        cause: 'Lỗ chân lông bị bít kín bởi dầu và da chết.',
        advice: 'Sử dụng AHA và giữ vệ sinh da mặt sạch sẽ.',
        link: 'https://www.medicalnewstoday.com/articles/315104'
    },
    'Dark-Spots': {
        title: 'Thâm / Nám',
        definition: 'Các vùng da sẫm màu do tăng sắc tố.',
        cause: 'Hậu quả sau viêm mụn hoặc tiếp xúc ánh nắng.',
        advice: 'Dùng Vitamin C, Niacinamide và kem chống nắng.',
        link: 'https://www.aad.org/public/everyday-care/skin-care-basics/antaging/fade-dark-spots'
    },
    'Dry-Skin': {
        title: 'Da khô',
        definition: 'Da thiếu độ ẩm, gây bong tróc, thô ráp.',
        cause: 'Hàng rào bảo vệ da yếu, mất nước qua da.',
        advice: 'Dùng kem dưỡng chứa Ceramides hoặc HA.',
        link: 'https://www.healthline.com/health/dry-skin'
    },
    'Oily-Skin': {
        title: 'Da dầu',
        definition: 'Da tiết quá nhiều dầu, bề mặt bóng nhờn.',
        cause: 'Tuyến bã nhờn hoạt động quá mức.',
        advice: 'Dùng sữa rửa mặt dịu nhẹ, tránh sản phẩm chứa cồn.',
        link: 'https://www.medicalnewstoday.com/articles/321090'
    },
    'Englarged-Pores': {
        title: 'Lỗ chân lông to',
        definition: 'Bề mặt da có các lỗ li ti hiện rõ.',
        cause: 'Do tiết dầu nhiều hoặc lão hóa da.',
        advice: 'Dùng Niacinamide và làm sạch sâu định kỳ.',
        link: 'https://www.healthline.com/health/enlarged-pores'
    },
    'Wrinkles': {
        title: 'Nếp nhăn',
        definition: 'Các rãnh sâu xuất hiện trên da do thiếu hụt collagen.',
        cause: 'Lão hóa tự nhiên và tác động từ tia UV.',
        advice: 'Sử dụng Retinol và kem chống nắng hàng ngày.',
        link: 'https://www.mayoclinic.org/diseases-conditions/wrinkles/symptoms-causes/syc-20354406'
    },
    'Eyebags': {
        title: 'Bọng mắt',
        definition: 'Tình trạng sưng hoặc phồng dưới quầng mắt.',
        cause: 'Thiếu ngủ, lão hóa hoặc giữ nước.',
        advice: 'Dùng kem mắt chứa Caffeine và ngủ đủ giấc.',
        link: 'https://www.healthline.com/health/eye-bags'
    }
};