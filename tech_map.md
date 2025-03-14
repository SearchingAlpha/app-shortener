Goal: Build a minimalistic, functional app with a clean user experience, broken into precise, actionable steps for a developer. The app consists of two pages: a landing page to attract users and an input/output page to process text and display results.

User Interface Design

Goal: Create a simple, intuitive UI that guides users effortlessly from introduction to content generation.

- Landing Page UI:
    - Purpose: Quickly convey the app’s value and direct users to the tool.
    - Layout: Single, centered section occupying the full viewport height for instant impact.
    - Elements:
        - Headline:
            - Text: “Turn Your Long-Form Content Into Social Gold”
            - Style: Bold, large text (e.g., prominent and eye-catching), dark color (e.g., black or charcoal) for readability.
            - Placement: Centered, approximately 20% from the top to leave breathing room.
        - Subtext:
            - Text: “Paste your text, get platform-ready snippets in seconds.”
            - Style: Lighter weight, smaller text (e.g., half the headline size), slightly muted color (e.g., medium gray) to support the headline without competing.
            - Placement: Directly below headline, tight spacing (e.g., 10px gap) for visual connection.
        - Call-to-Action (CTA) Button:
            - Text: “Try It Now”
            - Style: Rounded corners, solid background (e.g., vibrant blue or green), white text, medium size, with subtle hover effect (e.g., slight darkening).
            - Behavior: Links directly to the Input/Output Page, no delays or modals.
            - Placement: Centered below subtext, with generous padding (e.g., 20px above/below) for prominence.
    - Visuals:
        - Background: Solid white or faint gray to keep focus on text.
        - No images, icons, or decorations—purely text-driven for speed and simplicity.
    - Responsiveness:
        - Mobile: Stack elements vertically, reduce text size slightly, ensure button remains tappable (e.g., minimum 44px height).
        - Desktop: Constrain content to a centered max-width (e.g., 800px) for readability.
- Input/Output Page UI:
    - Purpose: Provide a single, distraction-free space for users to input text and view generated snippets.
    - Layout: Single-column, vertical stack split into two logical sections: Input (top) and Output (bottom).
    - Elements:
        - Input Section:
            - Text Box:
                - Style: Wide, rectangular textarea (e.g., 80% of viewport width, 300px height), thin border (e.g., 1px gray), no shadows or heavy styling.
                - Placeholder: “Paste your article or blog post here…” (light gray, italicized) to prompt action.
                - Behavior: Accepts plain text input, no formatting toolbar—purely functional.
                - Placement: Near page top, centered, with padding (e.g., 20px from top edge) for breathing room.
            - Submit Button:
                - Text: “Generate Snippets”
                - Style: Matches CTA (e.g., rounded, solid blue/green, white text), clear and clickable.
                - Behavior: Triggers AI processing when clicked; disables and changes to “Generating…” during processing to prevent duplicate clicks.
                - Placement: Centered below text box, small gap (e.g., 10px) for visual separation.
        - Output Section:
            - Container: Appears only after submission, below input section, constrained to same max-width as input (e.g., 80% or 800px).
            - Snippet Cards:
                - Platforms: Four outputs—“X Post,” “LinkedIn Post,” “Instagram Caption,” “Substack Note.”
                - Style:
                    - Each card is a rectangular box (e.g., light gray background, 1px gray border, 10px padding).
                    - Label: Platform name at top (e.g., “X Post” in bold, 14px, black).
                    - Snippet: Generated text below label (e.g., 14px, black), wrapping naturally within card width.
                    - Counter: Bottom right corner (e.g., “280/280” for X, 12px, gray) to show length limits.
                - Behavior:
                    - Inline Editing: Click snippet text to edit directly (like a contenteditable field), updates live with no “save” step.
                    - Optional “Regenerate”: Small link or button (e.g., blue text, “Regenerate”) below counter to re-run AI for that platform only.
                - Placement: Cards stack vertically, equal width, with consistent spacing (e.g., 10px between cards).
            - Loading State: During AI processing, show a centered “Generating…” message or subtle spinner between input and output sections.
    - Visuals:
        - Background: Matches landing page (white/light gray) for consistency.
        - Palette: Limited to 2-3 colors (e.g., black text, gray accents, blue/green buttons) for simplicity.
    - Responsiveness:
        - Mobile: Text box and cards take full width, reduce font sizes slightly (e.g., snippets to 12px), stack naturally.
        - Desktop: Centered layout, wider text box and cards within max-width constraint.
- UI Flow:
    1. User arrives on Landing Page, reads headline and subtext, clicks “Try It Now.”
    2. Navigates to Input/Output Page, pastes or types text into the box, clicks “Generate Snippets.”
    3. Sees loading state briefly, then views four snippet cards, edits inline or regenerates as needed, copies text manually.
- Design Principles:
    - Simplicity: Only essential elements—no menus, sidebars, or popups.
    - Clarity: High-contrast text, obvious buttons, logical flow from input to output.
    - Speed: Lightweight design, minimal assets for fast loading.

Sub-Steps for Development

1. Set Up Project Structure
    - Create a basic project with two pages: Landing Page and Input/Output Page.
    - Include a simple navigation mechanism (e.g., button link) between them.
    - Ensure static assets (e.g., styles) are organized for easy access.
2. Build Landing Page (Hero Section)
    - Implement the centered layout with headline, subtext, and “Try It Now” button.
    - Apply minimal styling for a clean look, test responsiveness across screen sizes.
    - Verify the button links correctly to the Input/Output Page.
3. Create Input Section on Input/Output Page
    - Add a large textarea with placeholder text for user input.
    - Place a “Generate Snippets” button below it, styled consistently with the CTA.
    - Ensure the input area is prominent and easy to interact with on all devices.
4. Set Up Backend AI Integration
    - Configure a backend process to receive text from the input box via the submit button.
    - Integrate an AI engine to process the text and return snippets in a structured format (e.g., JSON with keys for X, LinkedIn, Instagram, Substack).
    - Define output rules:
        - X Post: Max 280 characters, concise and punchy.
        - LinkedIn Post: 2-3 sentences, professional tone.
        - Instagram Caption: Short (e.g., 125 characters), casual, hashtag-ready.
        - Substack Note: 1-2 sentences, teaser-style to hook readers.
5. Build Output Section on Input/Output Page
    - Display AI-generated snippets in four cards below the input section after submission.
    - Include platform labels, snippet text, and character/word counters in each card.
    - Ensure cards are visually distinct (e.g., borders) and stack cleanly in a single column.
6. Add Basic Editing Functionality
    - Enable inline editing by making snippet text clickable and editable directly in the card.
    - Add a “Regenerate” option per card to reprocess that platform’s snippet with the same input.
    - Keep changes live and simple—no persistent storage or complex undo features.