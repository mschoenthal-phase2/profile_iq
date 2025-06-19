export interface BiographyData {
  personalInput: string;
  professionalBiography: string;
  publicBiography: string;
  lastUpdated: Date;
  isGenerating?: boolean;
}

export interface BiographyFormData {
  personalInput: string;
}

export interface GeneratedBiographies {
  professional: string;
  public: string;
}

export interface BiographyDisplayProps {
  title: string;
  content: string;
  description: string;
  isGenerating?: boolean;
  onCopy?: () => void;
}
