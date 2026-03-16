---
name: unit-test-function
description: Write unit tests for a given function. Use when the user asks to write a unit test for a function, test this function, add tests for this function, or when they point at a function and request tests.
---

# Unit Test for This Function

## When to Use

Apply this skill when the user asks to write a unit test (or tests) for a specific function, or says "test this function" or similar.

## Workflow

1. **Identify the function**
   - Determine the function’s signature, parameters, return type, and side effects.
   - Note the file path and language/framework so tests live in the right place and use the right runner.

2. **Detect test framework and conventions**
   - Infer from the project: existing test files, `package.json` scripts, `pytest`/`jest`/`vitest`/`unittest`/etc.
   - Match existing patterns: test file location (e.g. `__tests__/`, `tests/`, `*_test.py`), naming (e.g. `test_<name>`), and how imports are done.

3. **Design test cases**
   - **Happy path**: typical inputs, expected output or behavior.
   - **Edge cases**: empty input, single item, boundaries, `null`/`None`/empty string.
   - **Errors**: invalid input, exceptions; assert the correct type/message or error code when relevant.

4. **Implement tests**
   - Create or update the test file next to the source or in the project’s test directory.
   - One test per behavior or scenario; names should describe the scenario (e.g. `test_returns_empty_when_input_empty`).
   - Follow project conventions (including variable naming, e.g. `__` prefix if required).

5. **Run tests**
   - Run the project’s test command for the new/updated file and fix any failures or lint issues.

## Test Structure (by framework)

- **Python (pytest)**: `def test_<scenario>():`; use `assert`; parametrize with `@pytest.mark.parametrize` when many inputs are similar.
- **JavaScript/TypeScript (Jest/Vitest)**: `test('description', () => { ... })` or `it('description', () => { ... })`; use `expect(...).toBe()` / `toThrow()` etc.
- **Python (unittest)**: Subclass `TestCase`, methods named `test_<scenario>`; use `self.assertEqual`, `self.assertRaises`, etc.

## What to Avoid

- Testing implementation details; focus on observable behavior and contracts.
- One giant test that does too much; prefer small, focused tests.
- Hard-coded paths or environment assumptions unless the test is explicitly integration-style.

## Example (Python, pytest)

Function under test:

```python
def parse_ids(raw: str) -> list[int]:
    if not raw:
        return []
    return [int(x.strip()) for x in raw.split(",")]
```

Tests:

```python
def test_returns_empty_list_for_empty_string():
    assert parse_ids("") == []

def test_returns_single_id():
    assert parse_ids("42") == [42]

def test_returns_multiple_ids():
    assert parse_ids("1, 2, 3") == [1, 2, 3]

def test_raises_for_invalid_input():
    with pytest.raises(ValueError):
        parse_ids("1, not_a_number")
```

## Summary Checklist

- [ ] Function signature and behavior understood
- [ ] Test framework and project layout matched
- [ ] Happy path, edge cases, and error cases covered
- [ ] Test file created/updated and tests run successfully
- [ ] Project naming and style conventions followed
