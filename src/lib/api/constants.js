// constants for the Google Places API
export const DEFAULT_RADIUS = 50000.0; // 50km aka 31mi

export const PLACES_FIELDS = [
    "places.name",
    "places.id",
    "places.types",
    "places.formattedAddress",
    "places.location",
    "places.rating",
    "places.googleMapsUri",
    "places.displayName.text",
    "places.primaryTypeDisplayName.text",
    "places.generativeSummary.overview.text",
    "places.generativeSummary.description.text",
    "places.editorialSummary.text",
].join(",");

export const PLACE_FIELDS = [
    "types",
    "formattedAddress",
    "location",
    "rating",
    "googleMapsUri",
    "displayName.text",
    "primaryTypeDisplayName.text",
    "generativeSummary.overview.text",
    "editorialSummary.text",
].join(",");

export const LOCALITIES_FIELDS = [
    "places.formattedAddress",
    "places.id",
    "places.location",
    "places.displayName.text",
    "places.googleMapsUri",
].join(",");

export const LOCALITY_FIELDS = [
    "formattedAddress",
    "id",
    "location",
    "displayName.text",
    "googleMapsUri",
].join(",");
