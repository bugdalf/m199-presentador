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

export interface Presentation {
  id?: string
  name: string
  isActive?: boolean
  slides?: Slide[]
}