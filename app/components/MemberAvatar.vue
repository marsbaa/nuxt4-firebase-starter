<template>
  <div
    :class="[
      'flex items-center justify-center rounded-full font-bold',
      sizeClasses,
      bgClass,
    ]"
    :style="{ color: '#a08670' }"
    :aria-label="`${name}'s avatar`"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
/**
 * MemberAvatar - Displays a circular avatar with member initials
 *
 * Shows two-letter initials on a warm background color based on the member's name.
 * Follows the pastoral care design aesthetic with soft, warm colors.
 *
 * @example
 * <MemberAvatar name="John Smith" />
 * <MemberAvatar name="Smith, John" size="lg" />
 */

interface Props {
  /** Member's name in either "LASTNAME, FIRSTNAME" or "Firstname Lastname" format */
  name: string;
  /** Avatar size variant */
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

// Size mappings
const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-8 h-8 text-xs";
    case "lg":
      return "w-14 h-14 text-base";
    case "md":
    default:
      return "w-10 h-10 text-xs";
  }
});

// Parse name to extract initials
const initials = computed(() => {
  if (!props.name || props.name.trim() === "") {
    return "??";
  }

  const trimmedName = props.name.trim();

  // Check if name is in "LASTNAME, FIRSTNAME" format
  if (trimmedName.includes(",")) {
    const parts = trimmedName.split(",").map((part) => part.trim());
    const lastName = parts[0] || "";
    const firstName = parts[1] || "";

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return firstInitial && lastInitial ? `${firstInitial}${lastInitial}` : "??";
  }

  // Otherwise assume "Firstname Lastname" format
  const parts = trimmedName.split(/\s+/);
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";
  const lastInitial = parts[1]?.charAt(0).toUpperCase() || "";

  return firstInitial && lastInitial
    ? `${firstInitial}${lastInitial}`
    : firstInitial || "??";
});

// Generate consistent background color based on name
// Uses a set of warm, pastoral colors that match the design aesthetic
const bgClass = computed(() => {
  // Simple hash function to generate consistent index from name
  const hash = Math.abs(
    props.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0),
  );

  // Warm, muted color palette matching the design
  const colors = [
    "bg-[#e8ddd0]", // Soft beige (SA style)
    "bg-[#e3d7c8]", // Light tan (LB style)
    "bg-[#dfd6c8]", // Warm gray-beige (GB style)
    "bg-[#e5d8ca]", // Peachy beige (PB style)
    "bg-[#e0d0c3]", // Muted tan (MB style)
    "bg-[#ddd4c8]", // Cool beige
    "bg-[#e6dcd1]", // Warm cream
    "bg-[#e1d5c6]", // Sandy beige
  ];

  return colors[hash % colors.length];
});
</script>
