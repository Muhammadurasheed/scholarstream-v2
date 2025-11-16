# 🧪 ScholarStream Testing Guide

## Quick Start Testing

### Prerequisites
1. **Backend Running**
   ```bash
   cd backend
   python run.py
   ```
   ✅ Should see: "Server will run at: http://localhost:8000"

2. **Frontend Running**
   ```bash
   npm run dev
   ```
   ✅ Should see: "Local: http://localhost:5173"

3. **Environment Variables**
   - Create `.env` in root with:
     ```
     VITE_API_BASE_URL=http://localhost:8000
     ```

---

## Test Scenarios

### 🎯 Test 1: Complete Onboarding Flow
**Goal:** Verify end-to-end integration from signup to dashboard with real data

#### Steps:
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Create account with email/password
4. Complete onboarding:
   - **Step 1:** Enter name (e.g., "Ahmed Khan")
   - **Step 2:** Select academic status (e.g., "Undergraduate - Junior")
   - **Step 3:** Enter school (e.g., "Stanford University"), GPA (e.g., 3.7), Major (e.g., "Computer Science")
   - **Step 4:** Select background (e.g., "First Generation", "Asian American")
   - **Step 5:** Select interests (e.g., "AI/ML", "Web Development", "Hackathons")
   - **Step 6:** Click "Complete Profile"

#### Expected Results:
✅ **Immediate (< 2 seconds):**
- Redirected to dashboard
- Toast: "🔍 Discovering opportunities..."
- Loading spinner visible

✅ **Within 5 seconds:**
- Dashboard shows 20-50 opportunity cards
- Stats update: "45 Scholarships Found"
- Toast: "✨ Found 45 opportunities! Discovering more..."

✅ **Within 10-30 seconds:**
- Additional opportunities appear
- Toast: "🎯 Found 8 more opportunities! Total: 53 matches"
- Final toast: "✅ Discovery complete! Matched 53 opportunities"

✅ **UI State:**
- No blank screens at any point
- Smooth animations
- Stats cards show accurate numbers
- Opportunity cards render correctly

#### Check Browser Console:
```javascript
// Should see successful API calls:
POST http://localhost:8000/api/scholarships/discover -> 200 OK
GET http://localhost:8000/api/scholarships/discover/{job_id} -> 200 OK
```

#### Check Backend Logs:
```
Discovery request received  user_id=...
Scraping complete  count=53
Discovery complete  total=53
```

---

### 🔄 Test 2: Returning User (Cached Data)
**Goal:** Verify localStorage caching and fast reload

#### Steps:
1. Complete Test 1 first
2. Refresh the page (F5)
3. Navigate away and back to dashboard

#### Expected Results:
✅ **Instant load** (< 1 second):
- Opportunities appear immediately from localStorage
- No "Discovering..." loading state
- Stats accurate from cache

✅ **Background refresh** (after 2-3 seconds):
- Silent API call to `/api/scholarships/matched`
- Updates data if backend has new opportunities
- No disruptive UI changes

#### Browser Console:
```javascript
// First load: POST /api/scholarships/discover
// Subsequent loads: GET /api/scholarships/matched (background)
```

---

### 🚨 Test 3: Backend Offline (Graceful Degradation)
**Goal:** Verify fallback to mock data when backend unavailable

#### Steps:
1. **Stop backend server** (Ctrl+C in backend terminal)
2. Clear browser data: `localStorage.clear()` in console
3. Sign up new user
4. Complete onboarding

#### Expected Results:
✅ **No crashes or blank screens**
✅ **Toast notification:**
   - "Backend unavailable, showing sample opportunities"
✅ **Dashboard displays mock data:**
   - ~10-15 sample opportunities visible
   - Stats show mock numbers
✅ **User can interact:**
   - Browse opportunities
   - Save favorites
   - Click cards (though apply won't work)

#### Browser Console:
```javascript
// Should see:
Failed to fetch...
Backend not available, using mock data
```

---

### ⏳ Test 4: Slow Network Simulation
**Goal:** Verify progressive loading and polling behavior

#### Steps:
1. Open Chrome DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Complete onboarding

#### Expected Results:
✅ **Loading states visible:**
- Spinner shows during API calls
- "Discovering opportunities..." message clear
✅ **Progressive updates:**
- Immediate results appear first
- Additional results stream in
- Each batch triggers toast notification
✅ **Timeout handling:**
- Polling stops after 30 seconds if incomplete
- User not stuck in infinite loading

---

### 🎨 Test 5: Different User Profiles
**Goal:** Verify matching algorithm adapts to different users

#### Steps:
Create 3 users with different profiles:

**User A - STEM Focus:**
- Major: Computer Science
- Interests: AI/ML, Coding, Hackathons
- GPA: 3.8
- Background: Asian American

**User B - Arts Focus:**
- Major: Fine Arts
- Interests: Photography, Design, Writing
- GPA: 3.5
- Background: Hispanic/Latino

**User C - Business Focus:**
- Major: Business Administration
- Interests: Entrepreneurship, Finance, Leadership
- GPA: 3.6
- Background: First Generation College Student

#### Expected Results:
✅ **Different opportunities for each:**
- User A sees more tech scholarships, hackathons, coding competitions
- User B sees arts scholarships, creative grants
- User C sees business scholarships, leadership programs

✅ **Match scores differ:**
- Same scholarship has different match_score for different users
- Priority levels adapt (urgent for one, medium for another)

---

### 💬 Test 6: Chat Assistant
**Goal:** Verify AI chat integration

#### Steps:
1. Navigate to dashboard
2. Click floating chat button (bottom-right)
3. Type: "Find urgent opportunities"
4. Send message

#### Expected Results:
✅ **Chat opens:**
- Slide-up animation smooth
- Welcome message visible

✅ **Message sent:**
- User message appears immediately
- "ScholarStream is typing..." indicator shows

✅ **Response received:**
- AI message appears within 3-5 seconds
- Opportunities displayed as mini-cards (if any match query)
- "View" and "Save" buttons functional

#### Browser Console:
```javascript
POST http://localhost:8000/api/chat -> 200 OK
```

#### Backend Logs:
```
Chat request received  user_id=...  message_preview="Find urgent opportunities"
Chat response generated  opportunities_found=5
```

---

## 🐛 Debugging Guide

### Problem: Dashboard shows 0 opportunities

**Steps to Debug:**
1. Open browser console (F12)
2. Check for errors:
   ```javascript
   // Look for:
   Failed to fetch
   CORS error
   404 Not Found
   ```

3. Check Network tab:
   - Is `/api/scholarships/discover` being called?
   - What's the response status? (200 = success)
   - Check response body - is it empty?

4. Check backend logs:
   - Did it receive the request?
   - Any errors during scraping?
   - Did it save to database?

**Common Causes:**
- ❌ Backend not running → Start it: `python run.py`
- ❌ Wrong API URL in .env → Check `VITE_API_BASE_URL`
- ❌ CORS not configured → Check `backend/app/main.py`
- ❌ Scrapers failing → Check backend error logs

---

### Problem: "Discovering..." never completes

**Steps to Debug:**
1. Check backend logs for errors
2. Verify job_id is being returned:
   ```javascript
   // In browser console Network tab:
   // POST /api/scholarships/discover response should have:
   { "job_id": "some-uuid-string", ... }
   ```

3. Check polling is working:
   ```javascript
   // Should see multiple:
   GET /api/scholarships/discover/{job_id}
   ```

4. Backend should show:
   ```
   Discovery complete  total=53
   ```

**Common Causes:**
- ❌ Job ID not generated → Check backend `matching_service.py`
- ❌ Polling endpoint not working → Test manually: `GET http://localhost:8000/api/scholarships/discover/test-id`
- ❌ Frontend timeout too short → Will auto-complete after 30s

---

### Problem: Toast notifications not appearing

**Steps to Debug:**
1. Check if `sonner` is installed:
   ```bash
   npm list sonner
   ```

2. Verify toast hook is imported:
   ```typescript
   import { useToast } from '@/hooks/use-toast';
   ```

3. Check browser console for toast errors

**Common Causes:**
- ❌ Toaster component not in root → Should be in `App.tsx`
- ❌ Toast hook not properly configured

---

### Problem: CORS errors

**Error in Console:**
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
1. Check `backend/app/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173", "http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Restart backend server

---

## 📊 Performance Benchmarks

### Target Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Initial page load | < 2s | Chrome DevTools Performance tab |
| First API call | < 3s | Network tab → Time column |
| Immediate results display | < 5s | Stopwatch from click to cards appearing |
| Full discovery | < 30s | Stopwatch from start to "completed" toast |
| UI responsiveness | 60 FPS | React DevTools Profiler |

### How to Test Performance

1. **Chrome DevTools Performance:**
   - Open DevTools → Performance
   - Click Record
   - Complete onboarding
   - Stop recording
   - Check for:
     - Long tasks (> 50ms)
     - Jank (frame drops)
     - Memory leaks

2. **Network Performance:**
   - DevTools → Network tab
   - Look at waterfall view
   - Check:
     - API call timing
     - Response sizes
     - Sequential vs parallel requests

3. **React Performance:**
   - React DevTools → Profiler
   - Record interaction
   - Check:
     - Component render times
     - Unnecessary re-renders
     - Large render trees

---

## ✅ Final Checklist

Before considering Phase 1 complete, verify:

- [ ] Sign up flow works
- [ ] Onboarding saves data correctly
- [ ] Discovery triggers on completion
- [ ] Dashboard receives and displays opportunities
- [ ] Stats cards show accurate numbers
- [ ] Opportunity cards render correctly
- [ ] Loading states appear and disappear properly
- [ ] Toast notifications work
- [ ] Error handling shows user-friendly messages
- [ ] Backend offline fallback works
- [ ] Returning user loads cached data
- [ ] Chat button appears (even if chat not fully functional yet)
- [ ] Mobile responsive (test on phone or DevTools device mode)
- [ ] No console errors in browser
- [ ] No errors in backend logs

---

## 🎯 Success Criteria

**Phase 1 is complete when:**
1. ✅ User completes onboarding
2. ✅ Dashboard shows real opportunities within 10 seconds
3. ✅ No blank screens or crashes
4. ✅ Graceful degradation if backend unavailable
5. ✅ Stats accurate and updating
6. ✅ Professional loading experience

**Test it now and report results!** 🚀

---

**Bismillah, let's make sure everything works perfectly!** 🤲
