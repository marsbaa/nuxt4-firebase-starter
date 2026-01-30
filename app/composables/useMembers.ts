/**
 * Member data interface for the application layer
 *
 * Note: This interface represents the app's view of member data.
 * The actual Firestore schema uses different field names:
 * - name → firstName, lastName, displayName
 * - suburb → city
 * - contact → phone
 * - memberSince → notes
 * - birthday, email, createdAt, updatedAt, createdBy → stored as Firestore Timestamps
 *
 * The server API handles the mapping between these formats.
 */
export interface Member {
  id?: string;
  name: string; // Mapped from displayName or "LASTNAME, FIRSTNAME" format
  birthday: string; // ISO string, mapped from Firestore Timestamp
  contact: string; // Mapped from phone field
  email: string;
  suburb: string; // Mapped from city field
  memberSince: string; // Mapped from notes field
  createdAt: string; // ISO string, mapped from Firestore Timestamp
  createdBy: string;
  updatedAt: string; // ISO string, mapped from Firestore Timestamp
  updatedBy?: string;
  importedAt?: string; // Legacy field from RTDB migration
}

/**
 * Parsed name components
 */
export interface ParsedName {
  firstName: string;
  lastName: string;
  fullName: string;
}

/**
 * Convert text to proper case (first letter uppercase, rest lowercase)
 * @param text - The text to convert
 * @returns The text in proper case
 */
const toProperCase = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Parse "LASTNAME, FIRSTNAME" format into components
 * Handles all caps, mixed case, and special characters
 *
 * @param name - The name string to parse (e.g., "SMITH, JOHN")
 * @returns Parsed name components with firstName, lastName, and fullName
 *
 * @example
 * ```typescript
 * parseMemberName("SMITH, JOHN") // { firstName: "John", lastName: "Smith", fullName: "John Smith" }
 * parseMemberName("doe") // { firstName: "", lastName: "Doe", fullName: "Doe" }
 * ```
 */
export const parseMemberName = (name: string): ParsedName => {
  if (!name || !name.includes(",")) {
    return {
      firstName: "",
      lastName: name || "",
      fullName: name || "",
    };
  }

  const [lastName, firstName] = name.split(",").map((s) => s.trim());

  return {
    firstName: toProperCase(firstName || ""),
    lastName: toProperCase(lastName || ""),
    fullName:
      `${toProperCase(firstName || "")} ${toProperCase(lastName || "")}`.trim(),
  };
};

/**
 * Calculate age from birthday string
 * Handles both "YYYY-MM-DD" and ISO timestamp formats
 *
 * @param birthday - The birthday string in ISO format
 * @returns The calculated age in years
 *
 * @example
 * ```typescript
 * calculateAge("1990-01-01") // 34 (assuming current year is 2024)
 * ```
 */
export const calculateAge = (birthday: string): number => {
  if (!birthday) return 0;

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
};

/**
 * Format birthday for display with age
 * Example: "Jan 19, 1945 • Age 81"
 *
 * @param birthday - The birthday string in ISO format
 * @returns Formatted birthday string with age
 *
 * @example
 * ```typescript
 * formatBirthday("1990-01-01") // "Jan 1, 1990 • Age 34"
 * formatBirthday("") // "No birthday set"
 * ```
 */
export const formatBirthday = (birthday: string): string => {
  if (!birthday) return "No birthday set";

  const date = new Date(birthday);
  const age = calculateAge(birthday);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatted} • Age ${age}`;
};

/**
 * Format contact info with fallback
 *
 * @param contact - The contact information string
 * @returns Formatted contact info or fallback message
 *
 * @example
 * ```typescript
 * formatContact("0412345678") // "0412345678"
 * formatContact("") // "No contact info"
 * ```
 */
export const formatContact = (contact: string): string => {
  return contact.trim() === "" ? "No contact info" : contact;
};

/**
 * Get member initials for avatar
 * Uses parsed first and last name
 *
 * @param name - The member name string
 * @returns Two-letter initials in uppercase
 *
 * @example
 * ```typescript
 * getMemberInitials("SMITH, JOHN") // "JS"
 * getMemberInitials("DOE") // "DO"
 * getMemberInitials("") // "??"
 * ```
 */
export const getMemberInitials = (name: string): string => {
  const { firstName, lastName } = parseMemberName(name);

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }

  return "??";
};

/**
 * Sort members by name (last name first)
 *
 * @param membersList - Array of member objects to sort
 * @returns New sorted array (original array is not modified)
 *
 * @example
 * ```typescript
 * const members = [
 *   { name: "SMITH, JOHN" },
 *   { name: "DOE, JANE" }
 * ];
 * sortMembersByName(members) // [{ name: "DOE, JANE" }, { name: "SMITH, JOHN" }]
 * ```
 */
export const sortMembersByName = (membersList: Member[]): Member[] => {
  return [...membersList].sort((a, b) => {
    const nameA = parseMemberName(a.name);
    const nameB = parseMemberName(b.name);

    // Sort by last name, then first name
    const lastNameCompare = nameA.lastName.localeCompare(nameB.lastName);
    if (lastNameCompare !== 0) return lastNameCompare;

    return nameA.firstName.localeCompare(nameB.firstName);
  });
};
