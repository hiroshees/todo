# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Build-less TODO app: static `index.html` + `style.css` + `app.js` (vanilla JS, no dependencies, no tests, no linter).

## Run

Open `index.html` in a browser, or serve the directory: `python3 -m http.server 8000`.

## Architecture

- All state lives in the `todos` array in `app.js` (`{id, text, done}`), persisted to `localStorage` under the key `todo-app.todos`. Every mutation goes through `update()` (save + full re-render); `render()` rebuilds the list from state, so don't mutate the DOM directly.
- The filter (`all`/`active`/`done`) is in-memory only and not persisted.
- Double-clicking an item's label enters inline edit mode (Enter commits, Escape cancels).
