import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button, Alert, Spin } from 'antd';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';

import { checkFacePose } from '../../../helper';

interface CameraCaptureModalProps {
    visible: boolean;
    position: 'left' | 'front' | 'right';
    label: string;
    onClose: () => void;
    onCapture: (file: File, previewUrl: string) => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
    visible,
    position,
    label,
    onClose,
    onCapture,
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [poseStatus, setPoseStatus] = useState<{ valid: boolean; message: string }>({
        valid: false,
        message: 'Đang khởi động camera...',
    });
    const [isCameraLoading, setIsCameraLoading] = useState(true);

    // 1. Mở camera khi modal được bật
    useEffect(() => {
        if (visible) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [visible, position]);

    const startCamera = async () => {
        setIsCameraLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraLoading(false);
        } catch (err) {
            console.error("Không thể mở camera:", err);
            setPoseStatus({ valid: false, message: "Không tìm thấy hoặc không thể truy cập Camera!" });
            setIsCameraLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setPoseStatus({ valid: false, message: 'Đang khởi động camera...' });
    };

    // 2. Loop quét face-api liên tục theo thời gian thực (Realtime tracking)
    useEffect(() => {
        let active = true;

        const trackPose = async () => {
            if (!active || !videoRef.current || isCameraLoading || !streamRef.current) {
                if (active) requestAnimationFrame(trackPose);
                return;
            }

            // Đảm bảo video đã sẵn sàng dữ liệu hình ảnh
            if (videoRef.current.readyState === 4) {
                try {
                    // Truyền trực tiếp element video vào hàm checkFacePose của bạn
                    const result = await checkFacePose(videoRef.current, position);
                    if (active) {
                        setPoseStatus({
                            valid: result.valid,
                            message: result.valid ? `Góc mặt hợp lệ! Có thể chụp.` : (result.message ?? 'Góc mặt không hợp lệ')
                        });
                    }
                } catch (error) {
                    console.error("Lỗi track pose:", error);
                }
            }

            if (active) requestAnimationFrame(trackPose);
        };

        if (visible && !isCameraLoading) {
            requestAnimationFrame(trackPose);
        }

        return () => {
            active = false;
        };
    }, [visible, isCameraLoading, position]);

    // 3. Hàm chụp ảnh từ luồng video hiện tại
    const handleSnap = () => {
        if (!videoRef.current || !poseStatus.valid) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Vẽ frame video hiện tại lên canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Chuyển canvas thành Blob/File để gửi lên API của bạn
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `capture_${position}.jpg`, { type: 'image/jpeg' });
                    const previewUrl = URL.createObjectURL(blob);
                    onCapture(file, previewUrl);
                    onClose();
                }
            }, 'image/jpeg', 0.95);
        }
    };

    return (
        <Modal
            title={`Chụp ảnh: ${label}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={680}
            centered
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <div style={{
                    position: 'relative', width: '100%', maxWidth: '640px', height: '480px',
                    background: '#000', borderRadius: '12px', overflow: 'hidden',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    {isCameraLoading && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#fff' }} spin />} />
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transform: 'scaleX(-1)'
                        }}
                    />
                </div>

                {/* Alert hiển thị trạng thái check góc mặt */}
                <Alert
                    message={poseStatus.message}
                    type={poseStatus.valid ? "success" : "warning"}
                    showIcon
                    style={{ width: '100%', fontWeight: 500 }}
                />

                <Button
                    type="primary"
                    shape="round"
                    size="large"
                    icon={<CameraOutlined />}
                    disabled={!poseStatus.valid}
                    onClick={handleSnap}
                    style={{ height: '50px', padding: '0 40px', fontSize: '16px' }}
                >
                    Chụp Ảnh
                </Button>
            </div>
        </Modal>
    );
};

export default CameraCaptureModal;