# Fonts

Download these from Google Fonts and place the `.ttf` files here.

## Required files

| File | Source |
|---|---|
| `NotoSerif-Regular.ttf` | https://fonts.google.com/specimen/Noto+Serif — download "Regular 400" |
| `PlusJakartaSans-Regular.ttf` | https://fonts.google.com/specimen/Plus+Jakarta+Sans — download "Regular 400" |
| `PlusJakartaSans-Medium.ttf` | Same — download "Medium 500" |
| `PlusJakartaSans-SemiBold.ttf` | Same — download "SemiBold 600" |

## Quick download via curl

```bash
# From the aethel/assets/fonts/ directory:

# Noto Serif Regular
curl -L "https://fonts.gstatic.com/s/notoserif/v23/ga6Iaw1J5X9T9RW6j9bNfFIWbTq6fMRRMw.ttf" -o NotoSerif-Regular.ttf

# Plus Jakarta Sans (download the variable font zip from Google Fonts and extract the static files)
# Or use the npm package: npm install @expo-google-fonts/plus-jakarta-sans
```

## Alternative: use @expo-google-fonts

```bash
npx expo install @expo-google-fonts/noto-serif @expo-google-fonts/plus-jakarta-sans
```

Then update App.tsx to use the expo-google-fonts imports instead of require().
