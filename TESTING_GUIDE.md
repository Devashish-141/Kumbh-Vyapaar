# Testing Guide: AI Product Assistant Real-Time Field Filling

## Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Merchant Hub**:
   - Open the application in your browser
   - Click "I'm a Business Owner" or navigate to `/merchant`
   - Log in if required

3. **Open AI Product Assistant**:
   - Look for the "AI Product Assistant" card
   - Click "Start Speaking" button

## Test Scenarios

### Scenario 1: Complete Product Information
**Say**: "I have a Tibetan wool shawl for 500 rupees, 10 pieces in stock"

**Expected Behavior**:
1. ✅ Name field glows → fills with "I have a Tibetan wool shawl" → shows checkmark
2. ✅ Price field glows → fills with "₹500" → shows checkmark
3. ✅ Stock field glows → fills with "10 units" → shows checkmark
4. ✅ Category field glows → fills with "General" → shows checkmark
5. 🔊 Voice announces each field being filled
6. Shows confirmation dialog

### Scenario 2: Product with Category
**Say**: "Handmade jewelry necklace, price is 2000 rupees, 5 items available"

**Expected Behavior**:
1. ✅ Name: "Handmade jewelry necklace"
2. ✅ Price: "₹2000"
3. ✅ Stock: "5 units"
4. ✅ Category: "Jewelry" (auto-detected)

### Scenario 3: Food Item
**Say**: "Fresh Nashik grapes, 100 rupees per kg, 50 kg in stock, food category"

**Expected Behavior**:
1. ✅ Name: "Fresh Nashik grapes"
2. ✅ Price: "₹100"
3. ✅ Stock: "50 units"
4. ✅ Category: "Food" (auto-detected)

### Scenario 4: Hindi Language Test
**Steps**:
1. Change language to Hindi (हिंदी)
2. Click microphone button
3. Say: "मेरे पास ऊनी शॉल है, पांच सौ रुपये, दस पीस"

**Expected Behavior**:
- Voice announcements in Hindi
- UI text in Hindi
- Fields fill correctly

## What to Observe

### Visual Feedback
- [ ] Active field has **orange/saffron glowing border**
- [ ] Active field has **pulsing animation**
- [ ] Completed fields show **green background**
- [ ] Completed fields show **checkmark icon**
- [ ] Pending fields have **gray neutral appearance**

### Audio Feedback
- [ ] AI announces "Filling product name: [value]"
- [ ] AI announces "Filling price: [value] rupees"
- [ ] AI announces "Filling stock: [value] units"
- [ ] AI announces "Filling category: [value]"
- [ ] Final announcement: "All fields filled. Should I add this product?"

### Processing Indicator
- [ ] Shows "Filling..." text
- [ ] Shows current field name
- [ ] Has animated spinner icon
- [ ] Appears during processing stage

### Timing
- [ ] Each field announcement lasts ~1.5 seconds
- [ ] Fields are processed sequentially (not all at once)
- [ ] Smooth transitions between fields

## Troubleshooting

### No Voice Recognition
- **Issue**: Microphone button doesn't work
- **Solution**: Ensure you're using Chrome, Edge, or Safari
- **Solution**: Grant microphone permissions when prompted

### No Voice Synthesis
- **Issue**: AI doesn't speak
- **Solution**: Check browser audio settings
- **Solution**: Unmute browser/system audio

### Fields Not Highlighting
- **Issue**: No visual feedback
- **Solution**: Check browser supports CSS animations
- **Solution**: Clear browser cache and reload

### Incorrect Field Extraction
- **Issue**: Wrong values in fields
- **Solution**: Speak more clearly
- **Solution**: Use keywords like "rupees", "pieces", "stock"
- **Solution**: Click "Try Again" to re-record

## Browser Compatibility

| Browser | Voice Recognition | Voice Synthesis | Visual Feedback |
|---------|------------------|-----------------|-----------------|
| Chrome  | ✅ Yes           | ✅ Yes          | ✅ Yes          |
| Edge    | ✅ Yes           | ✅ Yes          | ✅ Yes          |
| Safari  | ✅ Yes (webkit)  | ✅ Yes          | ✅ Yes          |
| Firefox | ❌ Limited       | ✅ Yes          | ✅ Yes          |

## Sample Voice Inputs

### Clothing
- "Cotton t-shirt, 300 rupees, 20 pieces"
- "Silk saree for 5000 rupees, 3 items in stock"

### Jewelry
- "Silver ring, price 1500, 10 pieces available"
- "Gold necklace, 25000 rupees, 2 items"

### Food
- "Nashik grapes, 80 rupees, 100 kg stock"
- "Fresh pomegranate, 150 rupees per kg, 50 kg"

### Handicraft
- "Handmade pottery vase, 800 rupees, 5 pieces"
- "Wooden carving, 1200 rupees, 8 items"

### Electronics
- "Bluetooth speaker, 2000 rupees, 15 units"
- "Phone charger, 500 rupees, 30 pieces"

## Success Criteria

✅ All fields are filled correctly from voice input
✅ Visual highlighting works for each field
✅ Voice announcements are clear and accurate
✅ Checkmarks appear when fields are completed
✅ Processing indicator shows current field
✅ Confirmation dialog appears with all data
✅ Product is successfully added to database
✅ Works in both English and Hindi

## Known Limitations

1. **NLP Accuracy**: Uses basic pattern matching, not advanced NLP
2. **Category Detection**: Limited to predefined categories
3. **Voice Quality**: Depends on browser and OS speech synthesis
4. **Microphone**: Requires user permission and working microphone
5. **Network**: Requires internet for some browsers' speech recognition

## Feedback

If you encounter any issues or have suggestions for improvement, please note:
- Browser and version
- Operating system
- What you said (voice input)
- What was extracted (actual output)
- Expected behavior
