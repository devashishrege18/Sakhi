import React from 'react';

const Skeleton = ({ className, width, height, borderRadius = '0.75rem' }) => {
    return (
        <div
            className={`animate-pulse bg-white/5 ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius: borderRadius
            }}
        />
    );
};

export const ThreadSkeleton = () => (
    <div className="p-6 border border-white/5 bg-white/5 rounded-2xl space-y-4">
        <div className="flex gap-4 items-center">
            <Skeleton width="40px" height="40px" borderRadius="12px" />
            <div className="flex-1 space-y-2">
                <Skeleton width="30%" height="0.6rem" />
                <Skeleton width="70%" height="1.2rem" />
            </div>
        </div>
        <Skeleton width="100%" height="3rem" />
        <div className="flex gap-2">
            <Skeleton width="60px" height="20px" borderRadius="20px" />
            <Skeleton width="60px" height="20px" borderRadius="20px" />
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="aspect-[4/3] rounded-3xl bg-white/5 animate-pulse overflow-hidden relative p-6 flex flex-col justify-end">
        <div className="space-y-3">
            <Skeleton width="40%" height="0.8rem" />
            <Skeleton width="80%" height="1.5rem" />
            <div className="flex gap-2 mt-4">
                <Skeleton width="32px" height="32px" borderRadius="50%" />
                <Skeleton width="32px" height="32px" borderRadius="50%" />
            </div>
        </div>
    </div>
);

export default Skeleton;
