# 杈呭姪绾挎ā寮?(Guide Line Mode)

## TL;DR

> **Quick Summary**: 涓哄浘鐗囧垏鐗囧伐鍏锋坊鍔犺緟鍔╃嚎妯″紡鍔熻兘锛岀敤鎴峰彲閫氳繃 V/H 蹇嵎閿繘鍏ョ珫鐩?姘村钩杈呭姪绾挎ā寮忥紝榧犳爣璺熼殢棰勮杈呭姪绾夸綅缃紝鐐瑰嚮鏀剧疆杈呭姪绾匡紝杈呭姪绾挎樉绀哄潗鏍囧€肩敤浜庡揩閫熺‘瀹氬昂瀵搞€?> 
> **Deliverables**:
> - CanvasMode 绫诲瀷绯荤粺锛坰lice / verticalGuide / horizontalGuide锛?> - 閿洏蹇嵎閿郴缁燂紙V/H/Escape/Delete锛?> - 杈呭姪绾块紶鏍囪窡闅忛瑙堟晥鏋?> - 杈呭姪绾跨偣鍑绘斁缃笌鍧愭爣鏍囩鏄剧ず
> - 杈呭姪绾块€変腑涓庡垹闄や氦浜?> - 妯″紡鎸囩ず鍣?UI锛堟樉绀哄綋鍓嶆ā寮忥級
> - 娓呴櫎鎵€鏈夎緟鍔╃嚎鎸夐挳
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 鈫?Task 3 鈫?Task 4 鈫?Task 5 鈫?Task 6 鈫?Final Verification

---

## Context

### Original Request
娣诲姞涓€涓緟鍔╃嚎妯″紡锛岀敤鏉ュ湪鍥剧墖涓坊鍔犺緟鍔╃嚎锛屽叾涓湁涓や釜蹇嵎閿?v h銆倂 鐢ㄦ潵鍒涘缓绔栫洿杈呭姪绾匡紝h 鐢ㄦ潵鍒涘缓姘村钩杈呭姪绾裤€傜珫鐩磋緟鍔╃嚎鏄剧ず妯潗鏍囷紝姘村钩杈呭姪绾挎樉绀虹旱鍧愭爣銆傝繖涓姛鑳界敤鏉ュ揩閫熺‘瀹氬昂瀵搞€傚湪杩欎釜妯″紡涓嬬晫闈㈣鏈夋樉绀鸿〃鏄庢澶勪簬杈呭姪绾挎ā寮忥紝鍙互杩炵画娣诲姞杈呭姪绾裤€傚湪杈呭姪绾挎ā寮忎笅鏈夐紶鏍囪窡闅忥紝淇濊瘉鍙互鐭ラ亾褰撳墠绾夸細鍒掑埌鍝噷銆?
### Interview Summary
**Key Discussions**:
- 閫€鍑烘柟寮? 鎸?Escape 閿€€鍑鸿緟鍔╃嚎妯″紡
- 杈呭姪绾挎寔涔呮€? 鍒囨崲鍥炲垏鐗囨ā寮忔椂杈呭姪绾跨户缁樉绀猴紙浣滀负鍙傝€冪嚎锛?- 鍒犻櫎鍔熻兘: 闇€瑕佸垹闄ゅ崟鏉¤緟鍔╃嚎鍜屾竻闄ゅ叏閮ㄨ緟鍔╃嚎
- 鏀剧疆鏂瑰紡: 鐐瑰嚮鏀剧疆锛堥潪鎷栨嫿锛?
**Research Findings**:
- 椤圭洰浣跨敤 React 18 + TypeScript + Vite锛岀函 DOM 娓叉煋锛堟棤 Canvas API锛?- 娌℃湁鐜版湁鐨勬ā寮忕郴缁熷拰蹇嵎閿郴缁燂紝闇€浠庨浂寤虹珛
- 杈呭姪绾?overlay 闇€瑕佹墦鐮寸幇鏈?`pointer-events: none` 妯″紡锛堝姩鎬佸垏鎹級
- React 18 涓敭鐩樹簨浠堕渶浣跨敤 useRef bridge pattern 闃叉 stale closure
- 閿洏蹇嵎閿渶 input protection锛圫liceList 杈撳叆妗嗚仛鐒︽椂涓嶈Е鍙戯級

### Metis Review
**Identified Gaps** (addressed):
- **pointer-events 鍐茬獊**: 杈呭姪绾垮湪杈呭姪绾挎ā寮忎笅闇€ `pointer-events: auto`锛堝彲鐐瑰嚮閫変腑锛夛紝鍦ㄥ垏鐗囨ā寮忎笅闇€ `pointer-events: none`锛堢函瑙嗚鍙傝€冿級鈫?鍔ㄦ€佸垏鎹㈡柟妗?- **stale closure 椋庨櫓**: 閿洏浜嬩欢澶勭悊鍣ㄥ紩鐢?state 鏃跺瓨鍦?stale closure 鈫?浣跨敤 useRef bridge pattern
- **Delete 閿啿绐?*: SliceList 杈撳叆妗嗚仛鐒︽椂 Delete 浼氳鍒犺緟鍔╃嚎 鈫?娣诲姞 input protection
- **Escape 閿紭鍏堢骇**: 閫変腑杈呭姪绾挎椂鎸?Escape 鈫?鐩存帴閫€鍑烘ā寮忓苟鍙栨秷閫変腑锛堣€岄潪涓ゆ鎿嶄綔锛?- **杈呭姪绾挎斁缃笌閫変腑鍐茬獊**: 鐐瑰嚮杈呭姪绾块€変腑鏃朵笉搴斿悓鏃跺湪璇ヤ綅缃斁缃柊杈呭姪绾?鈫?stopPropagation
- **鏂板浘鐗囦笂浼?*: 搴旈噸缃ā寮忎负 slice 骞舵竻闄よ緟鍔╃嚎锛堟棫鍧愭爣鍦ㄦ柊鍥剧墖涓婃棤鎰忎箟锛?- **閲嶅杈呭姪绾?*: 鍏佽鍦ㄥ悓涓€鍧愭爣鏀剧疆澶氭潯杈呭姪绾匡紙涓嶅仛鍘婚噸锛岀畝鍗曞鐞嗭級
- **妯″紡 extensibility**: 浣跨敤 CanvasMode enum type 鑰岄潪 boolean flags锛屾柟渚挎湭鏉ユ墿灞?
---

## Work Objectives

### Core Objective
鍦ㄥ浘鐗囧垏鐗囧伐鍏蜂腑娣诲姞杈呭姪绾挎ā寮忥紝鏀寔绔栫洿鍜屾按骞宠緟鍔╃嚎鐨勫垱寤恒€侀瑙堛€佹斁缃€佸潗鏍囨樉绀恒€侀€変腑鍜屽垹闄わ紝涓虹敤鎴锋彁渚涘揩閫熸祴閲忓浘鐗囧昂瀵哥殑鍙傝€冨伐鍏枫€?
### Concrete Deliverables
- `src/types.ts`: 鏂板 `GuideLine` 鍜?`CanvasMode` 绫诲瀷
- `src/App.tsx`: 鏂板 mode銆乬uideLines銆乻electedGuideId 鐘舵€佸強鍥炶皟鍑芥暟
- `src/components/canvas/CanvasModule.tsx`: 妯″紡鎰熺煡鐨勯紶鏍囦氦浜?+ 杈呭姪绾挎覆鏌?+ 榧犳爣璺熼殢棰勮
- `src/components/controls/ControlBar.tsx`: 妯″紡鎸囩ず鍣?+ 娓呴櫎杈呭姪绾挎寜閽?- `src/hooks/useKeyboardShortcuts.ts`: 閿洏蹇嵎閿鐞?hook

### Definition of Done
- [ ] 鎸?V 閿繘鍏ョ珫鐩磋緟鍔╃嚎妯″紡锛屾寜 H 閿繘鍏ユ按骞宠緟鍔╃嚎妯″紡
- [ ] 杈呭姪绾挎ā寮忎笅榧犳爣璺熼殢鏄剧ず棰勮绾?- [ ] 鐐瑰嚮鏀剧疆杈呭姪绾匡紝鍙繛缁坊鍔?- [ ] 绔栫洿杈呭姪绾挎樉绀?X 鍧愭爣鍊硷紝姘村钩杈呭姪绾挎樉绀?Y 鍧愭爣鍊?- [ ] 鎸?Escape 閫€鍑鸿緟鍔╃嚎妯″紡鍥炲埌鍒囩墖妯″紡
- [ ] 杈呭姪绾垮湪鍒囩墖妯″紡涓嬬户缁彲瑙侊紙绾瑙夊弬鑰冿級
- [ ] 杈呭姪绾挎ā寮忎笅鍙偣鍑婚€変腑杈呭姪绾匡紝鎸?Delete 鍒犻櫎
- [ ] ControlBar 鏄剧ず褰撳墠妯″紡鏍囪瘑
- [ ] "娓呴櫎鎵€鏈夎緟鍔╃嚎"鎸夐挳鍙敤
- [ ] 鏂板浘鐗囦笂浼犳椂閲嶇疆妯″紡骞舵竻闄よ緟鍔╃嚎
- [ ] SliceList 杈撳叆妗嗚仛鐒︽椂蹇嵎閿笉瑙﹀彂
- [ ] `vitest run` 鍏ㄩ儴閫氳繃

### Must Have
- V/H 蹇嵎閿垏鎹㈣緟鍔╃嚎妯″紡锛堢珫鐩?姘村钩锛?- 榧犳爣璺熼殢棰勮鏁堟灉
- 鐐瑰嚮鏀剧疆杈呭姪绾?- 杈呭姪绾垮潗鏍囨爣绛撅紙绔栫洿鏄剧ず X锛屾按骞虫樉绀?Y锛?- Escape 閫€鍑鸿緟鍔╃嚎妯″紡
- 杈呭姪绾垮湪鍒囩墖妯″紡涓嬬户缁彲瑙?- 妯″紡鎸囩ず鍣?UI
- 鍒犻櫎鍗曟潯杈呭姪绾匡紙閫変腑 + Delete锛?- 娓呴櫎鎵€鏈夎緟鍔╃嚎鍔熻兘
- Input protection锛堣緭鍏ユ鑱氱劍鏃跺揩鎹烽敭涓嶈Е鍙戯級

### Must NOT Have (Guardrails)
- 鉂?杈呭姪绾挎嫋鎷界Щ鍔?閲嶆柊瀹氫綅鍔熻兘
- 鉂?杈呭姪绾垮惛闄勶紙slice 鍚搁檮鍒拌緟鍔╃嚎锛?- 鉂?杈呭姪绾块鑹茶嚜瀹氫箟
- 鉂?杈呭姪绾垮彲瑙佹€у紑鍏筹紙鏄剧ず/闅愯棌鎵€鏈夎緟鍔╃嚎锛?- 鉂?杈呭姪绾垮垪琛ㄩ潰鏉匡紙鍙充晶 sidebar锛?- 鉂?杈呭姪绾?undo/redo 绯荤粺
- 鉂?杈呭姪绾挎寔涔呭寲锛坙ocalStorage / URL state锛?- 鉂?浣跨敤 RxJS锛堥」鐩腑鏈変絾浠庢湭浣跨敤锛?- 鉂?鍧愭爣浣跨敤鐧惧垎姣旇€岄潪鍍忕礌
- 鉂?杈呭姪绾块棿璺?璺濈娴嬮噺鏄剧ず
- 鉂?AI slop: 杩囧害娉ㄩ噴銆佽繃搴︽娊璞°€乬eneric naming锛坉ata/result/item锛?
---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** - ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest + CanvasModule.test.tsx)
- **Automated tests**: YES (Tests-after 鈥?existing test infrastructure is basic, add tests alongside implementation)
- **Framework**: vitest

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) - Navigate, interact, assert DOM, screenshot
- **TUI/CLI**: Use interactive_bash (tmux)
- **API/Backend**: Use Bash (curl)
- **Library/Module**: Use Bash (node REPL / vitest)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - foundation + scaffolding):
鈹溾攢鈹€ Task 1: Type definitions + state scaffold [quick]
鈹溾攢鈹€ Task 2: Keyboard shortcut hook [unspecified-high]
鈹斺攢鈹€ Task 3: Mode-aware CanvasModule mouse behavior [unspecified-high]

Wave 2 (After Wave 1 - rendering + interaction + UI):
鈹溾攢鈹€ Task 4: Guide line rendering + coordinate labels (depends: 1, 3) [visual-engineering]
鈹溾攢鈹€ Task 5: Guide line selection + deletion (depends: 1, 2, 3) [unspecified-high]
鈹斺攢鈹€ Task 6: Mode indicator + clear all + upload reset (depends: 1, 2, 4) [visual-engineering]

Wave FINAL (After ALL tasks 鈥?4 parallel reviews):
鈹溾攢鈹€ F1: Plan compliance audit (oracle)
鈹溾攢鈹€ F2: Code quality review (unspecified-high)
鈹溾攢鈹€ F3: Real manual QA (unspecified-high + playwright)
鈹斺攢鈹€ F4: Scope fidelity check (deep)
鈫?Present results 鈫?Get explicit user okay
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | - | 3, 4, 5, 6 | 1 |
| 2 | - | 5, 6 | 1 |
| 3 | 1 | 4, 5 | 1 |
| 4 | 1, 3 | 6 | 2 |
| 5 | 1, 2, 3 | - | 2 |
| 6 | 1, 2, 4 | - | 2 |
| F1 | ALL | - | Final |
| F2 | ALL | - | Final |
| F3 | ALL | - | Final |
| F4 | ALL | - | Final |

### Agent Dispatch Summary

- **Wave 1**: 3 tasks - T1 鈫?`quick`, T2 鈫?`unspecified-high`, T3 鈫?`unspecified-high`
- **Wave 2**: 3 tasks - T4 鈫?`visual-engineering`, T5 鈫?`unspecified-high`, T6 鈫?`visual-engineering`
- **Final**: 4 tasks - F1 鈫?`oracle`, F2 鈫?`unspecified-high`, F3 鈫?`unspecified-high`, F4 鈫?`deep`

---

## TODOs

- [ ] 1. Type Definitions + State Scaffold

  **What to do**:
  - 鍦?`src/types.ts` 涓坊鍔?`CanvasMode` 绫诲瀷锛歚type CanvasMode = 'slice' | 'verticalGuide' | 'horizontalGuide'`
  - 鍦?`src/types.ts` 涓坊鍔?`GuideLine` interface锛歚{ id: string; orientation: 'vertical' | 'horizontal'; position: number }` 锛坧osition 涓哄浘鐗囧儚绱犲潗鏍囷紝绔栫洿绾挎槸 X锛屾按骞崇嚎鏄?Y锛?  - 鍦?`src/App.tsx` 涓坊鍔犵姸鎬侊細`const [mode, setMode] = useState<CanvasMode>('slice')`, `const [guideLines, setGuideLines] = useState<GuideLine[]>([])`, `const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)`
  - 鍦?`src/App.tsx` 涓坊鍔?handler 鍑芥暟锛?    - `handleAddGuideLine(orientation, position)` 鈫?鍒涘缓鏂?GuideLine 骞舵坊鍔犲埌 guideLines 鏁扮粍
    - `handleDeleteGuideLine(id)` 鈫?浠?guideLines 鏁扮粍涓Щ闄?    - `handleClearGuideLines()` 鈫?娓呯┖ guideLines 鏁扮粍
    - `handleSelectGuideLine(id)` 鈫?璁剧疆 selectedGuideId
    - `handleSetMode(newMode)` 鈫?璁剧疆 mode锛屽鏋滃垏鎹㈠埌 slice 鍒欐竻闄?selectedGuideId
  - 鍦?`src/App.tsx` 鐨?`handleUpload` 涓坊鍔狅細`setMode('slice')`, `setGuideLines([])`, `setSelectedGuideId(null)` 锛堟柊鍥剧墖涓婁紶鏃堕噸缃級
  - 鍦?`CanvasModuleProps` interface 涓坊鍔犳柊 props锛歚mode`, `guideLines`, `selectedGuideId`, `onAddGuideLine`, `onDeleteGuideLine`, `onSelectGuideLine`, `onClearGuideLines`
  - 鍦?`App.tsx` 鐨?JSX 涓皢鏂?props 浼犻€掔粰 `<CanvasModule />` 鍜?`<ControlBar />`
  - 纭繚**涓嶇牬鍧忕幇鏈夎涓?* 鈥?鎵€鏈夋柊澧?props 閮芥湁鍚堢悊鐨勯粯璁ゅ€?
  **Must NOT do**:
  - 鉂?涓嶄娇鐢?boolean flags锛堝 `isGuideMode`锛夛紝蹇呴』浣跨敤 CanvasMode enum type
  - 鉂?涓嶅皢 guideLines 鏀惧湪 CanvasModule local state锛堝繀椤绘斁鍦?App.tsx 浠ヨ法妯″紡鍏变韩锛?  - 鉂?涓嶅皢鍧愭爣鐢ㄧ櫨鍒嗘瘮琛ㄧず锛堜娇鐢ㄥ浘鐗囧儚绱犲潗鏍囷級
  - 鉂?涓嶅紩鍏?RxJS
  - 鉂?涓嶆坊鍔犺秴鍑烘湰浠诲姟鑼冨洿鐨勭被鍨?
  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 绫诲瀷瀹氫箟鍜?state 娣诲姞鏄函缁撴瀯鎬х殑浠ｇ爜鍙樻洿锛岄€昏緫绠€鍗?  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 3, 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/types.ts:1-16` 鈥?鐜版湁绫诲瀷瀹氫箟妯″紡锛坕nterface with id + coordinate fields锛?  - `src/App.tsx:10-11` 鈥?useState 澹版槑妯″紡
  - `src/App.tsx:31-58` 鈥?handler 鍑芥暟妯″紡锛坈allback + setState锛?  - `src/App.tsx:52-58` 鈥?handleCanvasAddSlice 妯″紡锛堝垱寤烘柊瀵硅薄 + crypto.randomUUID() + ...rect spread锛?
  **API/Type References**:
  - `src/types.ts:Slice` 鈥?id: string + x/y/w/h 妯″紡锛圙uideLine 搴旂被浼硷細id: string + orientation + position锛?  - `src/types.ts:ImageMeta` 鈥?width/height 鐢ㄤ簬杈呭姪绾挎覆鏌撹寖鍥?
  **WHY Each Reference Matters**:
  - `types.ts` 鈥?蹇呴』閬靛惊鐜版湁绫诲瀷瀹氫箟椋庢牸锛坕nterface + id + 鍩烘湰瀛楁锛夛紝淇濇寔涓€鑷存€?  - `App.tsx:10-11` 鈥?state 澹版槑妯″紡锛実uideLines 鍜?mode 闇€閬靛惊鍚屾牱鐨?useState 妯″紡
  - `App.tsx:31-58` 鈥?handler 鍑芥暟妯″紡锛堝畾涔夊湪 App 绾у埆锛岄€氳繃 props 浼犻€掞級锛孏uideLine 鐨?CRUD handlers 闇€閬靛惊鍚屾牱妯″紡
  - `crypto.randomUUID()` 鈥?GuideLine id 搴斾娇鐢ㄤ笌 Slice 鐩稿悓鐨?id 鐢熸垚鏂瑰紡

  **Acceptance Criteria**:

  - [ ] `src/types.ts` 鍖呭惈 `CanvasMode` type 鍜?`GuideLine` interface
  - [ ] `src/App.tsx` 鍖呭惈 mode, guideLines, selectedGuideId state 鍙婄浉鍏?handlers
  - [ ] `src/App.tsx` 鐨?`handleUpload` 鍖呭惈 `setMode('slice')` + `setGuideLines([])` + `setSelectedGuideId(null)`
  - [ ] `CanvasModuleProps` 鍖呭惈鎵€鏈夋柊 props
  - [ ] App.tsx JSX 灏嗘柊 props 浼犻€掔粰 CanvasModule 鍜?ControlBar
  - [ ] `vitest run src/test/CanvasModule.test.tsx` 鈫?PASS锛堢幇鏈夋祴璇曚笉鍙楀奖鍝嶏級
  - [ ] `tsc --noEmit` 鈫?PASS锛堟柊澧炵被鍨嬫纭紪璇戯級

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Type definitions compile correctly
    Tool: Bash
    Preconditions: types.ts modified with CanvasMode and GuideLine
    Steps:
      1. Run `tsc --noEmit` in project root
      2. Verify no type errors related to CanvasMode or GuideLine
    Expected Result: Zero type errors, compilation succeeds
    Failure Indicators: TypeScript errors mentioning CanvasMode or GuideLine
    Evidence: .sisyphus/evidence/task-1-type-compile.txt

  Scenario: Existing tests still pass after state additions
    Tool: Bash
    Preconditions: App.tsx updated with new state, CanvasModuleProps extended
    Steps:
      1. Run `vitest run src/test/CanvasModule.test.tsx`
      2. Check all existing tests still pass
    Expected Result: All existing tests pass (5 tests, 0 failures)
    Failure Indicators: Any test failure or compilation error
    Evidence: .sisyphus/evidence/task-1-existing-tests.txt

  Scenario: handleUpload resets guide line state
    Tool: Bash (node REPL)
    Preconditions: App.tsx has handleUpload with setMode/setGuideLines/setSelectedGuideId calls
    Steps:
      1. Read App.tsx handleUpload function
      2. Verify it calls setMode('slice'), setGuideLines([]), setSelectedGuideId(null)
    Expected Result: All three reset calls present in handleUpload
    Failure Indicators: Missing any of the three reset calls
    Evidence: .sisyphus/evidence/task-1-upload-reset.txt
  ```

  **Commit**: YES (groups with 1)
  - Message: `feat(types): add GuideLine and CanvasMode type definitions`
  - Files: `src/types.ts`, `src/App.tsx`
  - Pre-commit: `vitest run`

- [ ] 2. Keyboard Shortcut Hook

  **What to do**:
  - 鍒涘缓鏂版枃浠?`src/hooks/useKeyboardShortcuts.ts`
  - 瀹炵幇 `useKeyboardShortcuts` hook锛屾帴鍙楀弬鏁帮細
    - `onSetMode(mode: CanvasMode)` 鈥?V/H/Escape 妯″紡鍒囨崲
    - `onDeleteSelected()` 鈥?Delete 鍒犻櫎閫変腑杈呭姪绾?    - `currentMode: CanvasMode` 鈥?褰撳墠妯″紡锛堢敤浜?stale closure 闃叉姢锛?    - `selectedGuideId: string | null` 鈥?褰撳墠閫変腑 ID锛堢敤浜?stale closure 闃叉姢锛?  - **浣跨敤 useRef bridge pattern** 闃叉 stale closure锛?    ```
    const modeRef = useRef(currentMode);
    const selectedRef = useRef(selectedGuideId);
    modeRef.current = currentMode;
    selectedRef.current = selectedGuideId;
    
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        // Input protection: skip when INPUT/TEXTAREA focused
        const tag = (document.activeElement?.tagName || '').toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        
        if (e.key === 'v' || e.key === 'V') {
          onSetMode('verticalGuide');
        } else if (e.key === 'h' || e.key === 'H') {
          onSetMode('horizontalGuide');
        } else if (e.key === 'Escape') {
          onSetMode('slice'); // 鍚屾椂娓呴櫎 selectedGuideId
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selectedRef.current) onDeleteSelected();
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [onSetMode, onDeleteSelected]); // 涓嶅寘鍚?mode/selectedGuideId 鈥?閫氳繃 ref 璇诲彇
    ```
  - 鍦?`src/App.tsx` 涓皟鐢?hook锛?    ```
    useKeyboardShortcuts({
      onSetMode: handleSetMode,
      onDeleteSelected: () => handleDeleteGuideLine(selectedGuideId!),
      currentMode: mode,
      selectedGuideId: selectedGuideId,
    });
    ```
  - 纭繚 `handleSetMode` 鍦ㄥ垏鎹㈠埌 `'slice'` 鏃跺悓鏃舵竻闄?`selectedGuideId`

  **Must NOT do**:
  - 鉂?涓嶅湪 useEffect 涓洿鎺ュ紩鐢?state 鍙橀噺锛堜細瀵艰嚧 stale closure锛?  - 鉂?涓嶅湪 INPUT/TEXTAREA 鑱氱劍鏃惰Е鍙戝揩鎹烽敭
  - 鉂?涓嶄娇鐢?RxJS
  - 鉂?涓嶆坊鍔犺秴鍑?V/H/Escape/Delete 鐨勫揩鎹烽敭
  - 鉂?涓嶄娇鐢?useEffectEvent锛圧eact 18 涓嶆敮鎸侊級

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 閿洏浜嬩欢澶勭悊娑夊強 React hooks 鐨?stale closure 闂锛岄渶瑕佷粩缁嗗鐞?useRef bridge pattern
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 5, 6
  - **Blocked By**: None (can start immediately 鈥?hook is standalone)

  **References**:

  **Pattern References**:
  - `src/App.tsx:1-11` 鈥?useState 澹版槑妯″紡锛坔ook 灏嗗紩鐢ㄨ繖浜?state锛?  - `src/App.tsx:60-81` 鈥?JSX 娓叉煋妯″紡锛坔ook 璋冪敤浣嶇疆锛?
  **External References**:
  - React useRef bridge pattern for keyboard handlers in React 18: Use `useRef` to store latest state values, update ref on every render, read from ref inside useEffect callback. This avoids stale closures without adding state to useEffect dependency array.

  **WHY Each Reference Matters**:
  - `App.tsx` 鈥?鐞嗚В state 澹版槑浣嶇疆鍜?props 浼犻€掓ā寮忥紝纭繚 hook 姝ｇ‘闆嗘垚
  - useRef bridge pattern 鈥?React 18 涓?useEffect + addEventListener 鐨勫叧閿ā寮忥紝闃叉 stale closure 瀵艰嚧蹇嵎閿鍙栬繃鏃剁殑 state

  **Acceptance Criteria**:

  - [ ] `src/hooks/useKeyboardShortcuts.ts` 鏂囦欢瀛樺湪
  - [ ] hook 浣跨敤 useRef bridge pattern锛坢odeRef, selectedRef锛?  - [ ] V/V 閿Е鍙?`onSetMode('verticalGuide')`
  - [ ] H/H 閿Е鍙?`onSetMode('horizontalGuide')`
  - [ ] Escape 閿Е鍙?`onSetMode('slice')` 骞舵竻闄ら€変腑
  - [ ] Delete/Backspace 閿Е鍙?`onDeleteSelected()`锛堜粎褰?selectedGuideId !== null锛?  - [ ] INPUT/TEXTAREA 鑱氱劍鏃舵墍鏈夊揩鎹烽敭琚烦杩?  - [ ] App.tsx 璋冪敤 useKeyboardShortcuts hook
  - [ ] `vitest run` 鈫?PASS

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: V key switches to vertical guide mode
    Tool: Bash (node REPL / vitest)
    Preconditions: App loaded with an image, mode is 'slice'
    Steps:
      1. Simulate keydown event with key='v' on window
      2. Verify mode state changes to 'verticalGuide'
    Expected Result: mode === 'verticalGuide'
    Failure Indicators: mode remains 'slice' or throws error
    Evidence: .sisyphus/evidence/task-2-v-key.txt

  Scenario: H key switches to horizontal guide mode
    Tool: Bash (node REPL / vitest)
    Preconditions: App loaded, mode is 'slice'
    Steps:
      1. Simulate keydown event with key='h' on window
      2. Verify mode state changes to 'horizontalGuide'
    Expected Result: mode === 'horizontalGuide'
    Failure Indicators: mode remains 'slice'
    Evidence: .sisyphus/evidence/task-2-h-key.txt

  Scenario: Escape exits guide mode and clears selection
    Tool: Bash (node REPL / vitest)
    Preconditions: mode is 'verticalGuide', selectedGuideId is 'some-id'
    Steps:
      1. Simulate keydown event with key='Escape' on window
      2. Verify mode changes to 'slice' and selectedGuideId is null
    Expected Result: mode === 'slice', selectedGuideId === null
    Failure Indicators: mode remains 'verticalGuide' or selectedGuideId unchanged
    Evidence: .sisyphus/evidence/task-2-escape-key.txt

  Scenario: Input protection 鈥?shortcuts skip when INPUT focused
    Tool: Bash (node REPL / vitest)
    Preconditions: A SliceList input element is focused (document.activeElement is INPUT)
    Steps:
      1. Set document.activeElement to an INPUT element
      2. Simulate keydown event with key='v' on window
      3. Verify mode does NOT change
    Expected Result: mode remains unchanged
    Failure Indicators: mode changes to 'verticalGuide'
    Evidence: .sisyphus/evidence/task-2-input-protection.txt

  Scenario: Delete key removes selected guide line
    Tool: Bash (node REPL / vitest)
    Preconditions: selectedGuideId is 'guide-123', guideLines has 2 items
    Steps:
      1. Simulate keydown event with key='Delete' on window
      2. Verify guideLines no longer contains the deleted item
      3. Verify selectedGuideId is null
    Expected Result: guideLines length decreases by 1, selectedGuideId === null
    Failure Indicators: guideLines unchanged or selectedGuideId unchanged
    Evidence: .sisyphus/evidence/task-2-delete-key.txt

  Scenario: Delete does nothing when no guide line selected
    Tool: Bash (node REPL / vitest)
    Preconditions: selectedGuideId is null
    Steps:
      1. Simulate keydown event with key='Delete' on window
      2. Verify guideLines unchanged
    Expected Result: guideLines array unchanged
    Failure Indicators: guideLines modified
    Evidence: .sisyphus/evidence/task-2-delete-no-selection.txt
  ```

  **Commit**: YES (groups with 2)
  - Message: `feat(hooks): add useKeyboardShortcuts hook with V/H/Escape/Delete`
  - Files: `src/hooks/useKeyboardShortcuts.ts`, `src/App.tsx`
  - Pre-commit: `vitest run`

- [ ] 3. Mode-Aware CanvasModule Mouse Behavior

  **What to do**:
  - 淇敼 `src/components/canvas/CanvasModule.tsx` 鐨勯紶鏍囦簨浠跺鐞嗭紝浣垮叾鏍规嵁 `mode` prop 鍒囨崲琛屼负
  - **鍒囩墖妯″紡 (`mode === 'slice'`)**: 淇濇寔鐜版湁鐨?slice 缁樺埗琛屼负锛坔andleMouseDown 鈫?handleMouseMove 鈫?handleMouseUp 缁樺埗鐭╁舰锛?  - **杈呭姪绾挎ā寮?(`mode === 'verticalGuide' | 'horizontalGuide'`)**:
    - `onMouseMove`: 鏇存柊 `guidePreviewPos` state锛堥紶鏍囪窡闅忓潗鏍囷級锛岀敤浜庢覆鏌撻瑙堣緟鍔╃嚎
    - `onMouseDown`: 鐐瑰嚮鏀剧疆杈呭姪绾?鈫?璋冪敤 `onAddGuideLine({ orientation: mode === 'verticalGuide' ? 'vertical' : 'horizontal', position: Math.round(coords.x 鎴?coords.y) })`
    - 涓嶇粯鍒剁煩褰紙isDrawing 淇濇寔 false锛?    - `onMouseLeave`: 娓呴櫎 guidePreviewPos锛堥瑙堢嚎娑堝け锛?  - 娣诲姞 `guidePreviewPos` state锛堜粎 CanvasModule local state锛夛細`{ x: number, y: number } | null`
  - 淇敼鍏夋爣鏍峰紡锛?    - slice mode: `cursor-crosshair`锛堢幇鏈夛級
    - verticalGuide mode: `cursor-col-resize`
    - horizontalGuide mode: `cursor-row-resize`
  - 鍔ㄦ€佽缃?`cursor` className 鎴?inline style based on mode

  **Must NOT do**:
  - 鉂?涓嶅湪杈呭姪绾挎ā寮忎笅鍏佽 slice 缁樺埗锛堟ā寮忎簰鏂ワ級
  - 鉂?涓嶄慨鏀圭幇鏈?slice 缁樺埗閫昏緫
  - 鉂?涓嶅皢 guidePreviewPos 鏀惧湪 App.tsx锛堝畠鏄复鏃?UI 鐘舵€侊紝浠?CanvasModule 闇€瑕侊級
  - 鉂?涓嶆敼鍙?getRelativeCoords 鍑芥暟锛堝畠宸茬粡姝ｇ‘澶勭悊浜?scroll offset锛?
  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 榧犳爣琛屼负妯″紡鍒囨崲娑夊強瀵圭幇鏈変氦浜掍唬鐮佺殑閲嶆瀯锛岄渶瑕佷粩缁嗗鐞嗘潯浠跺垎鏀拰閬垮厤鐮村潖鐜版湁鍔熻兘
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (浣嗕緷璧?Task 1 鐨勭被鍨嬪畾涔?
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 4, 5
  - **Blocked By**: Task 1 (闇€瑕?CanvasMode type 鍜?GuideLine type锛屼互鍙?CanvasModuleProps 鏂?props)

  **References**:

  **Pattern References**:
  - `src/components/canvas/CanvasModule.tsx:10-64` 鈥?鐜版湁榧犳爣浜嬩欢澶勭悊閫昏緫锛坕sDrawing, startPos, currentPos, getRelativeCoords锛?  - `src/components/canvas/CanvasModule.tsx:29-38` 鈥?handleMouseDown 妯″紡
  - `src/components/canvas/CanvasModule.tsx:40-43` 鈥?handleMouseMove 妯″紡
  - `src/components/canvas/CanvasModule.tsx:45-64` 鈥?handleMouseUp 妯″紡
  - `src/components/canvas/CanvasModule.tsx:17-27` 鈥?getRelativeCoords 鍑芥暟锛堢洿鎺ュ鐢紝涓嶉渶淇敼锛?  - `src/components/canvas/CanvasModule.tsx:81` 鈥?cursor-crosshair 褰撳墠鍊?
  **API/Type References**:
  - `src/types.ts:CanvasMode` 鈥?鏂板鐨?mode type锛堢敱 Task 1 鍒涘缓锛?  - `src/types.ts:GuideLine` 鈥?鏂板鐨?guide line type锛堢敱 Task 1 鍒涘缓锛?  - `src/components/canvas/CanvasModule.tsx:4-8` 鈥?CanvasModuleProps interface锛堢敱 Task 1 鎵╁睍锛?
  **WHY Each Reference Matters**:
  - `CanvasModule.tsx:10-64` 鈥?蹇呴』鐞嗚В鐜版湁榧犳爣浜嬩欢澶勭悊鐨勫畬鏁存祦绋嬶紝鎵嶈兘姝ｇ‘娣诲姞妯″紡鍒嗘敮鑰屼笉鐮村潖鐜版湁琛屼负
  - `CanvasModule.tsx:17-27` 鈥?getRelativeCoords 鏄潗鏍囪绠楃殑鏍稿績鍑芥暟锛岃緟鍔╃嚎鏀剧疆蹇呴』浣跨敤鍚屾牱鐨勫嚱鏁扮‘淇濆潗鏍囦竴鑷存€?  - `CanvasModule.tsx:81` 鈥?cursor 鏍峰紡闇€瑕佹牴鎹?mode 鍔ㄦ€佸彉鍖?  - `CanvasModuleProps` 鈥?鏂板鐨?mode 鍜?onAddGuideLine 绛?props 鏄浠诲姟鐨勬牳蹇冩帴鍙?
  **Acceptance Criteria**:

  - [ ] CanvasModule 鐨勯紶鏍囦簨浠舵牴鎹?mode prop 鍒嗘敮澶勭悊
  - [ ] slice mode: 鐜版湁鐭╁舰缁樺埗琛屼负涓嶅彉
  - [ ] verticalGuide mode: onMouseMove 鏇存柊 guidePreviewPos锛宱nMouseDown 璋冪敤 onAddGuideLine with orientation='vertical'
  - [ ] horizontalGuide mode: onMouseMove 鏇存柊 guidePreviewPos锛宱nMouseDown 璋冪敤 onAddGuideLine with orientation='horizontal'
  - [ ] cursor 鏍峰紡鏍规嵁 mode 鍔ㄦ€佸垏鎹紙crosshair / col-resize / row-resize锛?  - [ ] onMouseLeave 娓呴櫎 guidePreviewPos
  - [ ] 杈呭姪绾垮潗鏍囦娇鐢?Math.round 鍙栨暣
  - [ ] `vitest run` 鈫?PASS锛堢幇鏈?slice 缁樺埗娴嬭瘯涓嶅彈褰卞搷锛?
  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Slice drawing still works in slice mode
    Tool: Bash (vitest)
    Preconditions: mode === 'slice', image loaded
    Steps:
      1. Simulate mouseDown at (10, 10), mouseMove to (50, 50), mouseUp
      2. Verify onAddSlice called with {x: 10, y: 10, w: 40, h: 40}
    Expected Result: Slice created with correct coordinates
    Failure Indicators: onAddSlice not called or wrong coordinates
    Evidence: .sisyphus/evidence/task-3-slice-mode.txt

  Scenario: Vertical guide line created on click in verticalGuide mode
    Tool: Bash (vitest)
    Preconditions: mode === 'verticalGuide', image loaded
    Steps:
      1. Simulate mouseDown at (150, 200)
      2. Verify onAddGuideLine called with {orientation: 'vertical', position: 150}
    Expected Result: Guide line created at x=150
    Failure Indicators: onAddGuideLine not called or wrong orientation/position
    Evidence: .sisyphus/evidence/task-3-vertical-guide.txt

  Scenario: Horizontal guide line created on click in horizontalGuide mode
    Tool: Bash (vitest)
    Preconditions: mode === 'horizontalGuide', image loaded
    Steps:
      1. Simulate mouseDown at (150, 200)
      2. Verify onAddGuideLine called with {orientation: 'horizontal', position: 200}
    Expected Result: Guide line created at y=200
    Failure Indicators: onAddGuideLine not called or wrong orientation/position
    Evidence: .sisyphus/evidence/task-3-horizontal-guide.txt

  Scenario: Slice drawing disabled in guide mode
    Tool: Bash (vitest)
    Preconditions: mode === 'verticalGuide', image loaded
    Steps:
      1. Simulate mouseDown + mouseMove + mouseUp
      2. Verify onAddSlice is NOT called
    Expected Result: No slice created
    Failure Indicators: onAddSlice called (slice drawing should be blocked)
    Evidence: .sisyphus/evidence/task-3-slice-disabled.txt

  Scenario: Guide preview follows mouse in guide mode
    Tool: Bash (vitest)
    Preconditions: mode === 'verticalGuide', image loaded
    Steps:
      1. Simulate mouseMove at (300, 100)
      2. Verify guidePreviewPos state is {x: 300, y: 100}
    Expected Result: Preview position matches mouse coordinates
    Failure Indicators: guidePreviewPos not updated or wrong values
    Evidence: .sisyphus/evidence/task-3-preview-follows.txt

  Scenario: Preview disappears on mouse leave
    Tool: Bash (vitest)
    Preconditions: mode === 'verticalGuide', guidePreviewPos has a value
    Steps:
      1. Simulate mouseLeave event on container
      2. Verify guidePreviewPos becomes null
    Expected Result: guidePreviewPos === null
    Failure Indicators: guidePreviewPos not cleared
    Evidence: .sisyphus/evidence/task-3-preview-clear.txt

  Scenario: Cursor style changes per mode
    Tool: Playwright
    Preconditions: App loaded with image
    Steps:
      1. In slice mode, check canvas container has cursor-crosshair
      2. Press V, check container has cursor-col-resize
      3. Press H, check container has cursor-row-resize
      4. Press Escape, check container has cursor-crosshair
    Expected Result: Cursor matches mode at each step
    Failure Indicators: Cursor unchanged or wrong cursor type
    Evidence: .sisyphus/evidence/task-3-cursor-style.png
  ```

  **Commit**: YES (groups with 3)
  - Message: `feat(canvas): add mode-aware mouse behavior for guide lines`
  - Files: `src/components/canvas/CanvasModule.tsx`
  - Pre-commit: `vitest run`

- [ ] 4. Guide Line Rendering + Coordinate Labels

  **What to do**:
  - 鍦?`CanvasModule.tsx` 鐨?JSX 涓覆鏌撹緟鍔╃嚎 overlay锛堝湪 slices overlay 涔嬪悗銆乨rawingRect 涔嬪墠鐨勪綅缃彃鍏ワ級
  - **宸叉斁缃殑杈呭姪绾挎覆鏌?*锛?    - 绔栫洿杈呭姪绾匡細`<div>` with `position: absolute; left: line.position; top: 0; width: 1px; height: 100%; backgroundColor: rgba(0, 200, 180, 0.8)` 鈥?浠庡浘鐗囬《閮ㄥ埌搴曢儴鐨勭粏绾?    - 姘村钩杈呭姪绾匡細`<div>` with `position: absolute; top: line.position; left: 0; height: 1px; width: 100%; backgroundColor: rgba(0, 200, 180, 0.8)` 鈥?浠庡浘鐗囧乏杈瑰埌鍙宠竟鐨勭粏绾?    - 杈呭姪绾块鑹诧細闈掕壊 rgba(0, 200, 180, 0.8)锛堜笌绾㈣壊 slice 鍜岃摑鑹?drawing rect 鍖哄垎锛?  - **鍧愭爣鏍囩**锛?    - 绔栫洿杈呭姪绾匡細鍦ㄨ緟鍔╃嚎椤堕儴宸︿晶鏄剧ず X 鍧愭爣鍊硷紙濡?"150"锛?    - 姘村钩杈呭姪绾匡細鍦ㄨ緟鍔╃嚎宸︿晶涓婃柟鏄剧ず Y 鍧愭爣鍊硷紙濡?"200"锛?    - 鏍峰紡锛氬皬鍙峰瓧浣擄紙text-xs锛夈€佺櫧鑹叉枃瀛椼€佹繁鑹茶儗鏅紙bg-gray-800锛夈€乸adding銆乸ointer-events-none
    - 瀹氫綅锛氱珫鐩寸嚎鏍囩 `{position: absolute; left: line.position + 2; top: 0}`锛涙按骞崇嚎鏍囩 `{position: absolute; top: line.position + 2; left: 0}`
  - **閫変腑鐘舵€?*锛?    - 閫変腑鐨勮緟鍔╃嚎锛氬鍔犵嚎瀹藉埌 2px锛岄鑹叉洿浜?rgba(0, 255, 230, 1.0)锛屾垨娣诲姞楂樹寒杈规
    - 鏈€変腑鐨勮緟鍔╃嚎锛氫繚鎸?1px rgba(0, 200, 180, 0.8)
  - **pointer-events 鍔ㄦ€佸垏鎹?*锛?    - 杈呭姪绾挎ā寮忥細`pointer-events: auto`锛堝彲鐐瑰嚮閫変腑锛?    - 鍒囩墖妯″紡锛歚pointer-events: none`锛堢函瑙嗚鍙傝€冿紝涓嶅奖鍝?slice 缁樺埗锛?    - 鍧愭爣鏍囩濮嬬粓 `pointer-events: none`锛堜笉鍙偣鍑伙級
  - **榧犳爣璺熼殢棰勮绾挎覆鏌?*锛?    - verticalGuide mode 棰勮锛氱珫鐩村崐閫忔槑绾?at `guidePreviewPos.x`锛岄鑹?rgba(0, 200, 180, 0.4)
    - horizontalGuide mode 棰勮锛氭按骞冲崐閫忔槑绾?at `guidePreviewPos.y`锛岄鑹?rgba(0, 200, 180, 0.4)
    - 棰勮绾夸粎褰?`guidePreviewPos !== null` 涓?`mode !== 'slice'` 鏃舵覆鏌?  - 杈呭姪绾垮湪鎵€鏈夋ā寮忎笅閮藉彲瑙侊紙persistent reference锛?
  **Must NOT do**:
  - 鉂?涓嶆坊鍔犺緟鍔╃嚎棰滆壊鑷畾涔?  - 鉂?涓嶆坊鍔犺緟鍔╃嚎闂磋窛/璺濈娴嬮噺鏄剧ず
  - 鉂?涓嶆坊鍔犺緟鍔╃嚎鍒楄〃闈㈡澘
  - 鉂?涓嶄娇鐢?Canvas API锛堝潥鎸?DOM overlay 妯″紡锛?  - 鉂?涓嶆坊鍔犺櫄绾挎牱寮忥紙浣跨敤瀹炵嚎锛?  - 鉂?涓嶅湪鍒囩墖妯″紡涓嬭杈呭姪绾?pointer-events: auto

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 杈呭姪绾跨殑瑙嗚娓叉煋锛堢嚎鏉°€佹爣绛俱€侀瑙堢嚎銆侀€変腑楂樹寒锛夊睘浜?UI/瑙嗚瀹炵幇
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (渚濊禆 Task 1 鍜?Task 3)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 6
  - **Blocked By**: Task 1 (GuideLine type), Task 3 (guidePreviewPos state + mode-dependent mouse behavior)

  **References**:

  **Pattern References**:
  - `src/components/canvas/CanvasModule.tsx:91-103` 鈥?Slice overlay 娓叉煋妯″紡锛坅bsolute div + border + bg + pointer-events-none + inline style锛?  - `src/components/canvas/CanvasModule.tsx:106-116` 鈥?Drawing rect overlay 娓叉煋妯″紡
  - `src/index.css:125-131` 鈥?bg-checkerboard 鑷畾涔?utility锛堣緟鍔╃嚎娓叉煋鍦?checkerboard 涔嬩笂锛?
  **API/Type References**:
  - `src/types.ts:GuideLine` 鈥?GuideLine interface锛坕d, orientation, position锛?  - `src/types.ts:ImageMeta` 鈥?width/height 鐢ㄤ簬杈呭姪绾挎覆鏌撹寖鍥?
  **WHY Each Reference Matters**:
  - `CanvasModule.tsx:91-103` 鈥?蹇呴』閬靛惊鐜版湁 overlay 娓叉煋妯″紡锛坅bsolute positioned divs inside the relative container锛夛紝淇濇寔瑙嗚涓€鑷存€?  - `CanvasModule.tsx:106-116` 鈥?drawing rect 鐨勬覆鏌撲綅缃拰妯″紡鏄緟鍔╃嚎娓叉煋鐨勫弬鑰冿紙鎻掑叆浣嶇疆搴斿湪 slices 涔嬪悗锛?  - `ImageMeta.width/height` 鈥?杈呭姪绾块渶瑕佺煡閬撳浘鐗囧昂瀵告潵娓叉煋瀹屾暣鐨勭珫鐩?姘村钩绾?
  **Acceptance Criteria**:

  - [ ] 绔栫洿杈呭姪绾挎覆鏌撲负 1px 瀹界殑鍏ㄩ珮闈掕壊绾匡紝position === line.position
  - [ ] 姘村钩杈呭姪绾挎覆鏌撲负 1px 楂樼殑鍏ㄥ闈掕壊绾匡紝position === line.position
  - [ ] 绔栫洿杈呭姪绾挎爣绛炬樉绀?X 鍧愭爣鍊硷紙濡?"150"锛?  - [ ] 姘村钩杈呭姪绾挎爣绛炬樉绀?Y 鍧愭爣鍊硷紙濡?"200"锛?  - [ ] 閫変腑杈呭姪绾挎湁鏄庢樉鐨勮瑙夊樊寮傦紙2px 绾垮鎴栭珮浜鑹诧級
  - [ ] 杈呭姪绾?pointer-events 鏍规嵁妯″紡鍔ㄦ€佸垏鎹?  - [ ] 鍧愭爣鏍囩濮嬬粓 pointer-events: none
  - [ ] 棰勮绾垮湪杈呭姪绾挎ā寮忎笅璺熼殢榧犳爣锛堝崐閫忔槑锛?  - [ ] 棰勮绾垮湪 onMouseLeave 鏃舵秷澶?  - [ ] 杈呭姪绾垮湪鍒囩墖妯″紡涓嬪彲瑙佷絾 pointer-events: none

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Vertical guide line renders at correct position with X label
    Tool: Playwright
    Preconditions: App loaded with image, vertical guide line at x=150 exists in guideLines state
    Steps:
      1. Open app with image loaded
      2. Verify a vertical line div exists at left: 150px with height: 100%
      3. Verify a label near the line top shows "150"
    Expected Result: Cyan line at x=150 with coordinate label "150"
    Failure Indicators: Line missing, wrong position, or label missing/wrong value
    Evidence: .sisyphus/evidence/task-4-vertical-line.png

  Scenario: Horizontal guide line renders at correct position with Y label
    Tool: Playwright
    Preconditions: App loaded, horizontal guide line at y=200 exists
    Steps:
      1. Verify a horizontal line div exists at top: 200px with width: 100%
      2. Verify a label near the line left shows "200"
    Expected Result: Cyan line at y=200 with coordinate label "200"
    Failure Indicators: Line missing, wrong position, or label missing/wrong value
    Evidence: .sisyphus/evidence/task-4-horizontal-line.png

  Scenario: Selected guide line has different visual style
    Tool: Playwright
    Preconditions: Guide line exists and selectedGuideId matches its id
    Steps:
      1. Verify selected line has 2px width or brighter color
      2. Verify unselected line has 1px width and standard color
    Expected Result: Visual distinction between selected and unselected lines
    Failure Indicators: No visual difference between states
    Evidence: .sisyphus/evidence/task-4-selected-style.png

  Scenario: Guide preview line follows mouse in vertical guide mode
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', image loaded, mouse at x=300
    Steps:
      1. Press V to enter vertical guide mode
      2. Move mouse to x=300 on the canvas
      3. Verify a semi-transparent vertical line appears at left: 300px
    Expected Result: Preview line visible at mouse position, semi-transparent (rgba alpha ~0.4)
    Failure Indicators: No preview line or wrong position
    Evidence: .sisyphus/evidence/task-4-preview-vertical.png

  Scenario: Guide preview disappears on mouse leave
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', preview line visible
    Steps:
      1. Move mouse outside the canvas container
      2. Verify no preview line rendered
    Expected Result: Preview line disappears
    Failure Indicators: Preview line still visible
    Evidence: .sisyphus/evidence/task-4-preview-leave.png

  Scenario: Guide lines visible but non-interactive in slice mode
    Tool: Playwright
    Preconditions: Guide lines exist, mode === 'slice'
    Steps:
      1. Verify guide lines still render visually
      2. Verify guide line divs have pointer-events: none (not clickable)
    Expected Result: Lines visible, clicks pass through to canvas for slice drawing
    Failure Indicators: Lines invisible or clickable (blocking slice drawing)
    Evidence: .sisyphus/evidence/task-4-slice-mode-visibility.png
  ```

  **Commit**: YES (groups with 4)
  - Message: `feat(canvas): render guide lines with coordinate labels`
  - Files: `src/components/canvas/CanvasModule.tsx`
  - Pre-commit: `vitest run`

- [ ] 5. Guide Line Selection + Deletion Interaction

  **What to do**:
  - 涓鸿緟鍔╃嚎娣诲姞鐐瑰嚮閫変腑浜や簰
  - **鍦ㄨ緟鍔╃嚎妯″紡涓?*锛坧ointer-events: auto锛夛細
    - 鐐瑰嚮杈呭姪绾?div 鈫?璋冪敤 `onSelectGuideLine(line.id)` + `e.stopPropagation()`锛堥槻姝㈠悓鏃跺湪璇ュ潗鏍囨斁缃柊杈呭姪绾匡級
    - 鐐瑰嚮鐢诲竷绌虹櫧鍖哄煙 鈫?璋冪敤 `onSelectGuideLine(null)` 鍙栨秷閫変腑
    - 閫変腑鍚庢寜 Delete/Backspace 鈫?鍒犻櫎璇ヨ緟鍔╃嚎锛堢敱 Task 2 鐨勯敭鐩?hook 澶勭悊锛?  - **瑙嗚鍙嶉**锛?    - 閫変腑杈呭姪绾匡細绾垮鍙樹负 2px锛岄鑹插彉涓?rgba(0, 255, 230, 1.0)锛堥珮浜級
    - 鍙栨秷閫変腑鍚庢仮澶?1px rgba(0, 200, 180, 0.8)
  - **閫変腑绾挎秷澶卞姩鐢?*锛堝彲閫夛級锛氬垹闄ゆ椂杈呭姪绾挎秷澶憋紙鐩存帴 remove from DOM锛?  - 纭繚 `e.stopPropagation()` 鍦ㄨ緟鍔╃嚎 onClick 涓紝闃叉 click 浜嬩欢浼犳挱鍒?container 鐨?onMouseDown

  **Must NOT do**:
  - 鉂?涓嶆坊鍔犳嫋鎷界Щ鍔ㄨ緟鍔╃嚎鍔熻兘
  - 鉂?涓嶅湪鍒囩墖妯″紡涓嬪厑璁歌緟鍔╃嚎閫変腑锛坧ointer-events: none锛?  - 鉂?涓嶆坊鍔犺緟鍔╃嚎鍙抽敭鑿滃崟
  - 鉂?涓嶆坊鍔?undo/redo

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 閫変腑浜や簰娑夊強浜嬩欢鍐掓场鎺у埗锛坰topPropagation锛夊拰 pointer-events 鍔ㄦ€佸垏鎹紝闇€瑕佷粩缁嗗鐞嗕氦浜掗€昏緫
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (涓?Task 4 鍜?Task 6 鍦ㄥ悓涓€ Wave)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (GuideLine type), Task 2 (Delete key handler), Task 3 (mode-dependent mouse behavior)

  **References**:

  **Pattern References**:
  - `src/components/canvas/CanvasModule.tsx:91-103` 鈥?Slice overlay 娓叉煋锛堢幇鏈?pointer-events: none锛岃緟鍔╃嚎闇€瑕佹潯浠舵€?pointer-events: auto锛?  - `src/components/canvas/CanvasModule.tsx:29-38` 鈥?handleMouseDown锛堥渶瑕?stopPropagation 闃叉鍐茬獊锛?
  **API/Type References**:
  - `src/types.ts:GuideLine.id` 鈥?鐢ㄤ簬 selectedGuideId 鍖归厤
  - `src/App.tsx` 鈥?selectedGuideId state 鍜?handleSelectGuideLine/handleDeleteGuideLine handlers

  **WHY Each Reference Matters**:
  - `CanvasModule.tsx:91-103` 鈥?褰撳墠鎵€鏈?overlay 閮芥槸 pointer-events: none銆傝緟鍔╃嚎闇€瑕佹墦鐮磋繖涓ā寮忎絾鍙湪杈呭姪绾挎ā寮忎笅銆傜悊瑙ｇ幇鏈夋ā寮忔墠鑳芥纭坊鍔犳潯浠舵€?pointer-events銆?  - `handleMouseDown` 鈥?鐐瑰嚮杈呭姪绾跨殑浜嬩欢鍙兘涓?container 鐨?mouseDown 鍐茬獊锛堟棦閫変腑杈呭姪绾垮張鏀剧疆鏂扮嚎锛夈€俿topPropagation 鏄叧閿€?
  **Acceptance Criteria**:

  - [ ] 杈呭姪绾挎ā寮忎笅鐐瑰嚮杈呭姪绾?鈫?閫変腑锛坰electedGuideId 鏇存柊锛?  - [ ] 杈呭姪绾挎ā寮忎笅鐐瑰嚮绌虹櫧鍖哄煙 鈫?鍙栨秷閫変腑
  - [ ] 閫変腑杈呭姪绾胯瑙夋牱寮忎笉鍚岋紙2px 绾垮鎴栭珮浜鑹诧級
  - [ ] Delete 閿垹闄ら€変腑杈呭姪绾?  - [ ] 杈呭姪绾?onClick 浣跨敤 e.stopPropagation() 闃叉鏀剧疆鍐茬獊
  - [ ] 鍒囩墖妯″紡涓嬭緟鍔╃嚎涓嶅彲閫変腑锛坧ointer-events: none锛?  - [ ] 鍒犻櫎鍚?selectedGuideId 娓呴櫎涓?null

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Click on guide line selects it in guide mode
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', vertical guide line at x=150 exists, pointer-events: auto
    Steps:
      1. Click on the guide line div at left: 150
      2. Verify selectedGuideId equals the line's id
      3. Verify line visual style changes (2px width or bright color)
    Expected Result: Line selected with visual feedback
    Failure Indicators: selectedGuideId unchanged or no visual change
    Evidence: .sisyphus/evidence/task-5-select-line.png

  Scenario: Click on empty canvas deselects in guide mode
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', a guide line is selected
    Steps:
      1. Click on empty canvas area (not on any guide line)
      2. Verify selectedGuideId becomes null
    Expected Result: selectedGuideId === null
    Failure Indicators: selectedGuideId unchanged
    Evidence: .sisyphus/evidence/task-5-deselect.txt

  Scenario: Delete key removes selected guide line
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', guide line selected, 3 guide lines total
    Steps:
      1. Press Delete key
      2. Verify selected guide line disappears from DOM
      3. Verify guideLines state has 2 items
    Expected Result: Line removed, 2 lines remaining, selectedGuideId === null
    Failure Indicators: Line still visible or guideLines unchanged
    Evidence: .sisyphus/evidence/task-5-delete-selected.png

  Scenario: Guide line click does NOT place a new line at same position
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', guide line at x=150 exists
    Steps:
      1. Click on the guide line at x=150
      2. Verify onAddGuideLine is NOT called (stopPropagation prevented it)
      3. Verify no duplicate line appears
    Expected Result: Only selection happens, no new line created
    Failure Indicators: onAddGuideLine called or duplicate line visible
    Evidence: .sisyphus/evidence/task-5-no-duplicate.png

  Scenario: Guide lines not clickable in slice mode
    Tool: Playwright
    Preconditions: mode === 'slice', guide lines exist with pointer-events: none
    Steps:
      1. Click where a guide line is located
      2. Verify slice drawing starts (not guide line selection)
    Expected Result: Slice mouseDown handler fires, guide line click ignored
    Failure Indicators: Guide line selected or click blocked
    Evidence: .sisyphus/evidence/task-5-slice-mode-unselectable.png
  ```

  **Commit**: YES (groups with 5)
  - Message: `feat(canvas): add guide line selection and deletion`
  - Files: `src/components/canvas/CanvasModule.tsx`
  - Pre-commit: `vitest run`

- [ ] 6. Mode Indicator + Clear All + Upload Reset

  **What to do**:
  - **妯″紡鎸囩ず鍣?*锛氬湪 `ControlBar.tsx` 涓坊鍔犲綋鍓嶆ā寮忔樉绀?    - 鎺ユ敹鏂?props锛歚mode: CanvasMode`, `guideLineCount: number`, `onClearGuideLines: () => void`
    - 鏄剧ず褰撳墠妯″紡鏍囩锛?      - slice mode: 涓嶆樉绀洪澶栨寚绀猴紙榛樿鐘舵€侊級
      - verticalGuide mode: 鏄剧ず "鈫?绔栫洿杈呭姪绾? 鏍囩 + "鎸?Esc 閫€鍑? 鎻愮ず
      - horizontalGuide mode: 鏄剧ず "鈫?姘村钩杈呭姪绾? 鏍囩 + "鎸?Esc 閫€鍑? 鎻愮ず
    - 鏍峰紡锛氬皬 badge/鏍囩锛岄啋鐩絾涓嶅共鎵帮紝浣跨敤 cyan/teal 棰庤壊涓婚锛堜笌杈呭姪绾块鑹插懠搴旓級
  - **娓呴櫎杈呭姪绾挎寜閽?*锛?    - 褰?`guideLineCount > 0` 鏃舵樉绀?"娓呴櫎杈呭姪绾? 鎸夐挳
    - 鐐瑰嚮璋冪敤 `onClearGuideLines()`
    - 鎸夐挳鏍峰紡锛氬皬鍙锋枃瀛楁寜閽紝涓庣幇鏈?Upload 鎸夐挳椋庢牸涓€鑷?  - **涓婁紶閲嶇疆**锛?    - 鍦?`App.tsx` 鐨?`handleUpload` 涓‘淇?`setMode('slice')`, `setGuideLines([])`, `setSelectedGuideId(null)` 琚皟鐢紙宸插湪 Task 1 涓坊鍔狅紝姝や换鍔￠獙璇佸叾宸ヤ綔锛?
  **Must NOT do**:
  - 鉂?涓嶆坊鍔犺緟鍔╃嚎鍒楄〃闈㈡澘
  - 鉂?涓嶆坊鍔犺緟鍔╃嚎鍙鎬у紑鍏?  - 鉂?涓嶄负娓呴櫎杈呭姪绾挎坊鍔犻敭鐩樺揩鎹烽敭锛堜粎 UI 鎸夐挳锛?  - 鉂?涓嶅湪鍒囩墖妯″紡涓嬫樉绀烘ā寮忔爣绛?
  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 妯″紡鎸囩ず鍣ㄥ拰鎸夐挳鐨?UI 璁捐灞炰簬瑙嗚/浜や簰璁捐
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (涓?Task 5 鍦ㄥ悓涓€ Wave)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1 (CanvasMode type), Task 2 (閿洏 hook - 闇€楠岃瘉 Escape 閫€鍑?, Task 4 (杈呭姪绾挎覆鏌?- 闇€楠岃瘉杈呭姪绾垮彲瑙?

  **References**:

  **Pattern References**:
  - `src/components/controls/ControlBar.tsx:1-56` 鈥?鐜版湁 ControlBar 缁撴瀯锛坲pload 鎸夐挳 + image metadata锛?  - `src/components/controls/ControlBar.tsx:17` 鈥?div 甯冨眬缁撴瀯锛坔-20 border-t p-4 flex items-center space-x-6 bg-card锛?  - `src/components/controls/ControlBar.tsx:25-28` 鈥?鎸夐挳 UI 妯″紡锛坆g-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md锛?  - `src/App.tsx:60-81` 鈥?JSX 甯冨眬锛圕ontrolBar 浣嶇疆鍜?props 浼犻€掓ā寮忥級

  **API/Type References**:
  - `src/types.ts:CanvasMode` 鈥?妯″紡绫诲瀷鐢ㄤ簬鏉′欢娓叉煋
  - `src/App.tsx` 鈥?guideLines.length 浼犻€掔粰 ControlBar

  **WHY Each Reference Matters**:
  - `ControlBar.tsx` 鈥?蹇呴』閬靛惊鐜版湁甯冨眬鍜屾寜閽牱寮忔ā寮忥紝淇濇寔 UI 涓€鑷存€?  - `App.tsx:60-81` 鈥?闇€瑕佸皢鏂板 props锛坢ode, guideLineCount, onClearGuideLines锛変紶閫掔粰 ControlBar

  **Acceptance Criteria**:

  - [ ] verticalGuide mode: ControlBar 鏄剧ず "鈫?绔栫洿杈呭姪绾? 鎸囩ず鍣?  - [ ] horizontalGuide mode: ControlBar 鏄剧ず "鈫?姘村钩杈呭姪绾? 鎸囩ず鍣?  - [ ] slice mode: ControlBar 涓嶆樉绀洪澶栨ā寮忔寚绀?  - [ ] guideLineCount > 0 鏃舵樉绀?"娓呴櫎杈呭姪绾? 鎸夐挳
  - [ ] guideLineCount === 0 鏃朵笉鏄剧ず娓呴櫎鎸夐挳
  - [ ] 鐐瑰嚮娓呴櫎鎸夐挳 鈫?guideLines 娓呯┖
  - [ ] 鏂板浘鐗囦笂浼?鈫?mode 閲嶇疆涓?'slice'锛実uideLines 娓呯┖
  - [ ] ControlBar 鎺ユ敹 mode, guideLineCount, onClearGuideLines props

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Mode indicator shows vertical guide mode
    Tool: Playwright
    Preconditions: mode === 'verticalGuide'
    Steps:
      1. Press V to enter vertical guide mode
      2. Verify ControlBar displays "鈫?绔栫洿杈呭姪绾? indicator badge
      3. Verify "鎸?Esc 閫€鍑? hint text visible
    Expected Result: Mode indicator visible with correct text and hint
    Failure Indicators: No indicator or wrong text
    Evidence: .sisyphus/evidence/task-6-vertical-indicator.png

  Scenario: Mode indicator shows horizontal guide mode
    Tool: Playwright
    Preconditions: mode === 'horizontalGuide'
    Steps:
      1. Press H to enter horizontal guide mode
      2. Verify ControlBar displays "鈫?姘村钩杈呭姪绾? indicator badge
    Expected Result: Correct indicator visible
    Failure Indicators: No indicator or wrong text
    Evidence: .sisyphus/evidence/task-6-horizontal-indicator.png

  Scenario: No mode indicator in slice mode
    Tool: Playwright
    Preconditions: mode === 'slice'
    Steps:
      1. Verify no guide mode indicator badge in ControlBar
    Expected Result: No extra indicator visible
    Failure Indicators: Guide mode indicator still showing
    Evidence: .sisyphus/evidence/task-6-slice-no-indicator.png

  Scenario: Clear all button appears and works when guides exist
    Tool: Playwright
    Preconditions: 3 guide lines exist
    Steps:
      1. Verify "娓呴櫎杈呭姪绾? button visible in ControlBar
      2. Click the button
      3. Verify all guide lines disappear from canvas
      4. Verify button disappears (guideLineCount === 0)
    Expected Result: All lines cleared, button removed
    Failure Indicators: Lines remain or button still visible after clearing
    Evidence: .sisyphus/evidence/task-6-clear-all.png

  Scenario: Clear button not visible when no guides exist
    Tool: Playwright
    Preconditions: guideLines === []
    Steps:
      1. Verify "娓呴櫎杈呭姪绾? button NOT visible
    Expected Result: Button hidden
    Failure Indicators: Button visible when no guides
    Evidence: .sisyphus/evidence/task-6-no-clear-button.png

  Scenario: Image upload resets mode and clears guides
    Tool: Playwright
    Preconditions: mode === 'verticalGuide', 2 guide lines exist
    Steps:
      1. Upload a new image
      2. Verify mode changes to 'slice'
      3. Verify guide lines are gone
      4. Verify mode indicator disappears
    Expected Result: Mode reset, guides cleared, no indicator
    Failure Indicators: Mode unchanged or guides still visible
    Evidence: .sisyphus/evidence/task-6-upload-reset.png
  ```

  **Commit**: YES (groups with 6)
  - Message: `feat(ui): add mode indicator and clear-all button to ControlBar`
  - Files: `src/components/controls/ControlBar.tsx`, `src/App.tsx`
  - Pre-commit: `vitest run`


---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `vitest run`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

1. `feat(types): add GuideLine and CanvasMode type definitions` - src/types.ts
2. `feat(state): add mode and guide line state to App` - src/App.tsx, src/hooks/useKeyboardShortcuts.ts
3. `feat(canvas): add mode-aware mouse behavior for guide lines` - src/components/canvas/CanvasModule.tsx
4. `feat(canvas): render guide lines with coordinate labels` - src/components/canvas/CanvasModule.tsx
5. `feat(canvas): add guide line selection and deletion` - src/components/canvas/CanvasModule.tsx
6. `feat(ui): add mode indicator and clear-all button to ControlBar` - src/components/controls/ControlBar.tsx, src/App.tsx

---

## Success Criteria

### Verification Commands
```bash
vitest run                          # Expected: all tests pass
tsc --noEmit                        # Expected: no type errors
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
