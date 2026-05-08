declare global {

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    enum Gender {
        MALE = 'male',
        FEMALE = 'female',
        OTHER = 'other'
    }

    enum SkinCondition {
        ACNE = 'Acne',
        BLACKHEADS = 'Blackheads',
        DARK_SPOTS = 'Dark-Spots',
        DRY_SKIN = 'Dry-Skin',
        ENLARGED_PORES = 'Englarged-Pores',
        EYEBAGS = 'Eyebags',
        OILY_SKIN = 'Oily-Skin',
        WHITEHEADS = 'Whiteheads',
        WRINKLES = 'Wrinkles'
    }

    interface IUser {
        _id: string;
        email: string;
        password: string;
        fullName: string;
        age: number;
        gender: Gender,
        currentSkinTags: SkinCondition[],
        avatar?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IAccount {
        access_token: string;
        user: {
            _id: string;
            email: string;
            fullName: string;
            age: number;
            gender: Gender;
        },
    }

    export type FaceDirection = 'front' | 'left' | 'right';
    export interface CheckPoseResult {
        valid: boolean;
        message?: string;
    }

    interface Detection {
        label: string;
        confidence: number;
        bbox: number[];
        crop_url: string;
    }

    interface ViewResult {
        total: number;
        stats?: Record<string, number>;
        detections: Detection[];
        visualization_url: string;
    }

    interface DetectionResponse {
        total_acne: number;
        stats: Record<string, number>;
        results: {
            front: ViewResult;
            left: ViewResult;
            right: ViewResult;
        };
        original_images: Record<string, string>;
    }

    interface IUpload {
        url: string;
        public_id: string;
    }

    interface IProduct {
        _id: string;
        name: string;
        price: number;
        imageUrl: File;
        description: string;
    }

}