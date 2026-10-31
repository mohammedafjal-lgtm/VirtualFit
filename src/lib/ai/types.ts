export interface ClothingTags {
    category?: string;
    color?: string;
    style?: string;
    season?: string;
    description?: string;
  }
  
  export interface TryOnInput {
    /** URL of the person's portrait. */
    personImageUrl: string;
    /** Ordered list of garment image URLs. First item is applied first. */
    garmentImageUrls: string[];
    /** Optional description of each garment, aligned by index with garmentImageUrls. */
    garmentDescriptions?: string[];
    /** Optional category per garment (upper_body, lower_body, dresses). */
    garmentCategories?: string[];
  }
  
  export interface TryOnOutput {
    /** URL of the generated composite image. */
    resultUrl: string;
    /** Provider-specific raw response, for debugging. */
    raw?: unknown;
  }
  
  /**
   * Every AI provider must implement this interface.
   * Route handlers never import a provider SDK directly — only this contract.
   */
  export interface AIProvider {
    readonly name: string;
  
    /**
     * Analyze a clothing image and return structured tags.
     * Must never throw for a *successful* upload — return `{}` on model failure
     * so the item can still be saved.
     */
    tagClothing(imageUrl: string): Promise<ClothingTags>;
  
    /**
     * Generate a portrait title (e.g., "Outdoor Selfie").
     * Must fall back to a date-based title on failure.
     */
    generatePortraitTitle(imageUrl: string): Promise<string>;
  
    /**
     * Composite a person + garments into a try-on image.
     * May throw — the caller (background worker) will mark the job as failed.
     */
    generateTryOn(input: TryOnInput): Promise<TryOnOutput>;
  }