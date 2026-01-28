# Firebase RTDB Data Reference

This document provides the actual data structure from the existing Firebase Realtime Database for the Members collection.

## Database Path

```
/members/{memberId}
```

## Data Structure

### Example Member Entry

```json
{
  "-OZmKS9biJKzta5l0yXO": {
    "birthday": "1945-01-19",
    "contact": "",
    "createdAt": "2025-09-10T06:35:09.349Z",
    "createdBy": "kEupc4o3X1Wh5IlLK5agyCzeAyB3",
    "email": "",
    "importedAt": "2025-09-10T06:35:09.349Z",
    "memberSince": "2022-04-24",
    "name": "Auterson, SANDRA",
    "suburb": "Glen Waverley",
    "updatedAt": "2025-09-10T06:35:09.349Z"
  }
}
```

### Field Descriptions

| Field         | Type   | Required | Description                                          | Example Values                                                            |
| ------------- | ------ | -------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `birthday`    | string | Yes      | ISO date string in YYYY-MM-DD format                 | `"1945-01-19"`, `"2004-03-20T00:00:00.000Z"` (some have timestamp format) |
| `contact`     | string | Yes      | Phone number in +61 format, or empty string          | `"+61499187267"`, `""`                                                    |
| `createdAt`   | string | Yes      | ISO timestamp when member was created                | `"2025-09-10T06:35:09.349Z"`                                              |
| `createdBy`   | string | Yes      | Firebase user ID of creator                          | `"kEupc4o3X1Wh5IlLK5agyCzeAyB3"`                                          |
| `email`       | string | Yes      | Email address, usually empty                         | `""` (most are empty)                                                     |
| `importedAt`  | string | Optional | ISO timestamp when data was imported (legacy field)  | `"2025-09-10T06:35:09.349Z"`                                              |
| `memberSince` | string | Optional | ISO date string when member joined                   | `"2022-04-24"`, `""` (some are empty)                                     |
| `name`        | string | Yes      | Full name in "LASTNAME, FIRSTNAME" format (all caps) | `"Auterson, SANDRA"`, `"D'Souza, ANNA"`                                   |
| `suburb`      | string | Yes      | Location as free-text suburb name                    | `"Glen Waverley"`, `"Manila, Philippines"`                                |
| `updatedAt`   | string | Yes      | ISO timestamp of last update                         | `"2025-09-10T06:35:09.349Z"`                                              |
| `updatedBy`   | string | Optional | Firebase user ID of last editor                      | `"kEupc4o3X1Wh5IlLK5agyCzeAyB3"`                                          |

## Data Characteristics

### Name Format

- **Pattern**: `"LASTNAME, FIRSTNAME"` (all uppercase)
- **Special Cases**:
  - Names with apostrophes: `"D'Souza, ANNA"`
  - International names: `"Tresiglavić, MILAN"` (with diacritics)
  - Some names may be in mixed case: `"Hooi, Ethan"`

### Birthday Format

- **Primary Format**: `"YYYY-MM-DD"` (date string)
- **Alternative Format**: `"YYYY-MM-DDTHH:mm:ss.sssZ"` (ISO timestamp) - seen in some entries
- **Parsing**: Must handle both formats

### Contact Information

- **Phone Numbers**: Australian format `+61XXXXXXXXX` (10 digits after +61)
- **Empty Contacts**: Many members have empty string `""` for contact
- **Email**: Field exists but is rarely populated (mostly empty strings)

### Location

- **Format**: Free-text suburb name
- **Examples**:
  - Australian: `"Glen Waverley"`, `"Buninyong (Ballarat)"`, `"Nar Nar Goon"`
  - International: `"Manila, Philippines"`, `"Wales, UK"`

### Member Since

- **Format**: ISO date string `"YYYY-MM-DD"`
- **Can be empty**: Some members have empty string `""`

## Sample Data Summary

From the data export:

- **Total Members**: 66
- **Members with Contact Info**: ~48 (73%)
- **Members without Contact Info**: ~18 (27%)
- **All Emails**: Empty strings (email field not in use)
- **Age Range**: 15-81 years old
- **Locations**: Primarily Australian suburbs (Melbourne area)

## Implementation Notes

### Name Parsing

```typescript
// Parse "LASTNAME, FIRSTNAME" into components
function parseName(name: string): { firstName: string; lastName: string } {
  const [lastName, firstName] = name.split(",").map((s) => s.trim());
  return {
    firstName: toProperCase(firstName || ""),
    lastName: toProperCase(lastName),
  };
}

// Convert "SANDRA" to "Sandra"
function toProperCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
```

### Age Calculation

```typescript
// Calculate age from birthday string
function calculateAge(birthday: string): number {
  // Handle both "YYYY-MM-DD" and ISO timestamp formats
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
```

### Display Format

```typescript
// Format for display in table
function formatBirthday(birthday: string): string {
  const date = new Date(birthday);
  const age = calculateAge(birthday);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${formatted} • Age ${age}`;
}
// Result: "Jan 19, 1945 • Age 81"
```

### Contact Display

```typescript
// Show contact or fallback text
function formatContact(contact: string): string {
  return contact.trim() === "" ? "No contact info" : contact;
}
```

## Data Integrity

### Required Fields

When creating/editing members, ensure these fields are always present:

- `name` (in "LASTNAME, FIRSTNAME" format)
- `birthday` (ISO date string)
- `contact` (can be empty string)
- `email` (can be empty string)
- `suburb` (location text)
- `createdAt` (ISO timestamp)
- `updatedAt` (ISO timestamp)
- `createdBy` (user ID)

### Optional Fields

- `memberSince` (can be empty string or date)
- `importedAt` (legacy, don't set on new members)
- `updatedBy` (set only when editing existing members)

## Migration Notes

**No migration required** - The UI will work with the existing RTDB structure as-is. The implementation should:

1. Read data in the existing format
2. Parse and transform for display
3. Write back in the same format when creating/editing
4. Maintain backward compatibility with existing data
