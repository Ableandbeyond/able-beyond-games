# Able & Beyond - Life Skills Lab

This repository is a tiny Streamlit application.  The entire user interface and logic lives in `app.py`; there are no subpackages, services, or databases.  Images used by activities are stored in the `images/` directory next to the script.

## Big picture

1. **Single‑script Streamlit app**: `app.py` sets up `st.page_config` and immediately renders based on `st.session_state.page`.  Adding a new screen means adding an `elif` branch and a button to switch pages.
2. **Session state for navigation & game state**: every page is driven by keys in `st.session_state` (`page`, `order`, `matched`, `first_pick`, `message`, `level`).  Reset/reshuffle helper functions live inline in the socks activity.
3. **Styling**: there is a block of inline CSS with branded colours defined as constants at the top of `app.py`.  Reuse the `.card`, `.big`, `.small` classes when creating new UI pieces.
4. **Resource paths**: `BASE_DIR` and `IMG_DIR` are computed with `pathlib.Path(__file__).parent`.  Activity images (socks	e., `sock_a1.png`, etc.) must appear in `images/` and are referenced by filename.

## Developer workflow

- Install dependencies in a Python 3 venv; only external requirement is `streamlit`.
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate
  pip install streamlit
  ```
- Run the app with:
  ```bash
  streamlit run app.py
  ```
  Streamlit will open a browser, hot‑reload on file changes, and preserve `st.session_state` between edits.
- There are no automated tests; manual interaction is the only feedback loop.
- Images added to `images/` must match the naming convention used by the game logic (pairs in the `PAIRS` dict).

## Patterns & conventions

- **Page branching**: the top‑level `if st.session_state.page == "Home": ... elif ...` structure is how the app switches views.  Each page should be self‑contained; use helper functions like `render_header()` and `render_intro_card()` for shared UI.
- **Buttons** change `st.session_state.page` and call `st.rerun()` to force navigation.
- **Game loops**: the socks matching activity uses `reset_game()` and `reshuffle_unmatched()` defined inside its branch.  State keys are initialized only once with `if "key" not in st.session_state:` guards.
- **Progress & feedback**: UI messages are stored in state (`message`) and shown in `.card` elements.  A Streamlit `st.progress` bar reflects matches count; call `st.balloons()` when the round is complete.
- **Images** should be loaded with `st.image(str(img_path), use_container_width=True)` after checking existence.  Errors are surfaced with `st.error` when files are missing.

## Extending the codebase

- Add a new activity by copying the socks branch pattern:
  1. Add a button on the Home page that sets `st.session_state.page` to a unique string.
  2. Create a corresponding `elif` block and render UI.
  3. Store any activity‑specific data inside `st.session_state` using the existing initialization idiom.
  4. If you need new image assets, update `IMG_DIR` logic and reference filenames in the page code.
- Keep styling consistent by using the CSS classes at the top; adjust colour constants if branding changes.

## External dependencies & integration

- Only third‑party package is `streamlit` from PyPI.  There are no network calls, databases, or APIs.
- The app is primarily offline; images are local.

> **Note for AI assistants:**
> - All logic is contained in one file; reading `app.py` top‑to‑bottom is enough to reason about behaviour.
> - Look for `'page'` checks and `st.session_state` usage when tracing control flow.
> - When modifying UI, preserve the inline CSS block or update it accordingly.

Please review and let me know if any section is unclear or if there are other patterns I should document.