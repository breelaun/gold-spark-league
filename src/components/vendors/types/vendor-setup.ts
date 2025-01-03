export type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

export interface TemplateStyleConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string; // Added background color
  };
  font: string;
}

// Update SocialLinks to use an index signature
export interface SocialLinks extends Record<string, string> {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface VendorSetupState {
  selectedTemplate: number | null;
  selectedDisplay: string;
  selectedBento: string;
  socialLinks: SocialLinks;
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
}

// Helper type for database operations
export interface VendorProfileInsert {
  id: string;
  template_id: number | null;
  customizations: {
    display_style: string;
    bento_style: string;
  };
  business_description: string | null;
  social_links: Record<string, string>;
}