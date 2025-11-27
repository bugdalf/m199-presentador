export interface Slide {
  id?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  order: number;
  publicId: string;
  uploadedAt: any;
  url: string;
  videoUrl?: string;
}