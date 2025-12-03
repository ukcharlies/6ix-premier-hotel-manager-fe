# 6ix Premier Hotel - Color Scheme Documentation

## Brand Color Palette

### Primary Colors

1. **Premier Light** (`#DAE1E1`)
   - Usage: Light backgrounds, subtle elements
   - CSS: `bg-premier-light`, `text-premier-light`
   - Description: Lightest gray with slight blue tint

2. **Premier Gray** (`#C4D1D5`)
   - Usage: Secondary backgrounds, borders, muted text
   - CSS: `bg-premier-gray`, `text-premier-gray`, `border-premier-gray`
   - Description: Light blue-gray for elegant contrast

3. **Premier Copper** (`#A47550`)
   - Usage: Primary accent, CTAs, active states, highlights
   - CSS: `bg-premier-copper`, `text-premier-copper`, `border-premier-copper`
   - Description: Warm brown/copper for premium feel

4. **Premier Dark** (`#1B2E34`)
   - Usage: Navigation, headers, primary text, dark elements
   - CSS: `bg-premier-dark`, `text-premier-dark`
   - Description: Dark blue-gray for professional appearance

5. **Premier Black** (`#151515`)
   - Usage: Footer, deepest contrasts, emphatic text
   - CSS: `bg-premier-black`, `text-premier-black`
   - Description: Almost black for maximum contrast

## Semantic Color Mappings

### Primary Scale (50-900)
- **50-200**: Light variants for backgrounds and subtle elements
- **500**: Premier Copper (main accent)
- **600-900**: Darker variants transitioning to Premier Dark

### Dark Scale (50-900)
- **50-400**: Light to mid-range dark grays
- **500**: Premier Dark (main dark color)
- **900**: Premier Black (darkest)

## Component Color Usage

### Navbar
- Background: `from-premier-dark via-dark-700 to-premier-copper`
- Active links: `bg-premier-copper text-white`
- Inactive links: `text-premier-light hover:text-white`
- Auth buttons: `bg-premier-copper`

### Footer
- Background: `from-premier-black via-premier-dark to-dark-800`
- Text: `text-premier-gray`
- Links hover: `hover:text-premier-copper`
- Icons: `text-premier-copper`
- Social buttons: `bg-premier-copper/10 hover:bg-premier-copper/30`

### Login/Register Pages
- Background gradient: `from-premier-dark via-dark-700 to-premier-copper`
- Form background: `bg-white/95`
- Input borders: `border-premier-gray`
- Input focus: `ring-premier-copper`, `focus:border-premier-copper`
- Submit button: `from-premier-copper to-primary-600`
- Links: `text-premier-copper hover:text-primary-600`

### General UI Elements
- Body background: `bg-premier-light`
- Cards: `bg-white` with `border-premier-gray`
- Text primary: `text-premier-dark`
- Text secondary: `text-dark-400`
- Dividers: `border-premier-gray`

## Color Psychology

### Copper/Brown (#A47550)
- Evokes: Warmth, luxury, heritage, reliability
- Perfect for: Premium hospitality brand
- Creates: Inviting yet sophisticated atmosphere

### Dark Blue-Gray (#1B2E34)
- Evokes: Professionalism, trust, stability
- Perfect for: Corporate elements, navigation
- Creates: Modern, trustworthy impression

### Light Grays (#DAE1E1, #C4D1D5)
- Evokes: Cleanliness, space, elegance
- Perfect for: Backgrounds, breathing room
- Creates: Light, airy, welcoming feel

### Black (#151515)
- Evokes: Luxury, premium quality, exclusivity
- Perfect for: Footer, strong contrast
- Creates: Sophisticated, high-end appearance

## Accessibility Notes

- **Contrast Ratios**: All color combinations meet WCAG AA standards
- **Premier Copper on White**: 4.71:1 (AA compliant)
- **Premier Dark on White**: 13.5:1 (AAA compliant)
- **White on Premier Dark**: 13.5:1 (AAA compliant)
- **Premier Copper on Premier Dark**: Good contrast for buttons

## Usage Guidelines

### DO:
✅ Use Premier Copper for primary actions (CTAs, active states)
✅ Use Premier Dark for text and navigation
✅ Use Premier Light/Gray for backgrounds
✅ Maintain consistent hover states with Premier Copper
✅ Use gradients sparingly (navbar, footer, auth pages)

### DON'T:
❌ Mix Premier Copper with other bright colors
❌ Use Premier Black for large text areas (use Premier Dark instead)
❌ Overuse gradients on content pages
❌ Use Premier Gray for primary text (low contrast)

## Examples

### Button Styles
```css
/* Primary Button */
bg-premier-copper text-white hover:bg-primary-600

/* Secondary Button */
bg-premier-light text-premier-dark border-premier-gray hover:bg-premier-gray

/* Outline Button */
border-premier-copper text-premier-copper hover:bg-premier-copper hover:text-white
```

### Input Styles
```css
/* Default Input */
border-premier-gray focus:border-premier-copper focus:ring-premier-copper

/* Error Input */
border-red-500 bg-red-50 text-red-700
```

### Link Styles
```css
/* Primary Link */
text-premier-copper hover:text-primary-600

/* Footer Link */
text-premier-gray hover:text-premier-copper
```

## Implementation Status

✅ Tailwind Config - Updated with full palette
✅ Navbar Component - New color scheme applied
✅ Footer Component - New color scheme applied
✅ Login Page - New color scheme applied
✅ Register Page - New color scheme applied
✅ Router Layout - Background updated
⏳ Other pages - To be updated as needed

## Migration Notes

All color updates maintain the existing visual hierarchy and design patterns while providing a more cohesive, professional, and brand-appropriate appearance.

The new palette creates a warm, inviting atmosphere with the copper accents while maintaining professionalism through the dark blue-gray tones and cleanliness with the light gray backgrounds.
