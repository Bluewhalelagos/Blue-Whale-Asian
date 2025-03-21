/**
 * Translate text using Google Translate API (free tier)
 * @param text Text to translate
 * @param targetLang Target language code (default: 'pt' for Portuguese)
 * @returns Translated text
 */
export async function translateText(text: string, targetLang = "pt"): Promise<string> {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
        );
        const result = await response.json();
        return result[0][0][0]; // Extract translated text
    } catch (error) {
        console.error("Translation Error:", error);
        return text; // Return original text if translation fails
    }
}

/**
 * Translate all elements on the page with data-translate attributes
 * @param targetLang Target language code (default: 'pt' for Portuguese)
 */
export async function translatePage(targetLang = "pt"): Promise<void> {
    const elements = document.querySelectorAll("[data-translate]");
    for (let element of elements) {
        const originalText = element.getAttribute("data-translate");
        if (originalText) {
            const translatedText = await translateText(originalText, targetLang);
            element.textContent = translatedText;
        }
    }
}

/**
 * Translate a batch of texts at once to minimize API calls
 * @param texts Array of texts to translate
 * @param targetLang Target language code (default: 'pt' for Portuguese)
 * @returns Object with original texts as keys and translated texts as values
 */
export async function translateBatch(
    texts: string[], 
    targetLang = "pt"
): Promise<Record<string, string>> {
    try {
        // Join texts with a special separator that's unlikely to appear in normal text
        const combinedText = texts.join("|||___|||");
        const translatedCombined = await translateText(combinedText, targetLang);
        
        // Split the result and create a mapping
        const translatedParts = translatedCombined.split("|||___|||");
        const result: Record<string, string> = {};
        
        texts.forEach((original, index) => {
            result[original] = translatedParts[index] || original;
        });
        
        return result;
    } catch (error) {
        console.error("Batch translation error:", error);
        // Return unchanged texts if translation fails
        const result: Record<string, string> = {};
        texts.forEach(text => { result[text] = text; });
        return result;
    }
}