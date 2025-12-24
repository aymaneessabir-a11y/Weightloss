import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface PhotoUploadProps {
    onPhotoSelected: (file: File) => void;
    currentPhoto?: File | null;
}

export function PhotoUpload({ onPhotoSelected, currentPhoto }: PhotoUploadProps) {
    const [preview, setPreview] = useState<string | null>(
        currentPhoto ? URL.createObjectURL(currentPhoto) : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onPhotoSelected(file);
        }
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <Card variant="glass" className="p-6">
            <div className="flex flex-col items-center gap-4">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Sunday Progress Photo
                </label>

                {preview ? (
                    <div className="relative group">
                        {/* Image Preview Container with Apple-style rounded corners and shadow */}
                        <div className="relative w-48 h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <img
                                src={preview}
                                alt="Progress Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </div>

                        <button
                            onClick={handleClear}
                            className="absolute -top-2 -right-2 p-1.5 bg-destructive rounded-full text-white shadow-lg scale-0 group-hover:scale-100 transition-transform"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-48 h-64 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
                    >
                        <div className="p-4 rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                        <span className="text-xs text-muted-foreground">Tap to upload</span>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </Card>
    );
}
