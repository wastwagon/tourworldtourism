export type FaqItem = {
  question: string
  answer: string
}

export const CONTACT_FAQ: FaqItem[] = [
  {
    question: 'How do I book a tour with Tourworld Tourism?',
    answer:
      'Browse tours at /tours, open a tour for details and pricing, then submit the booking form on that page or contact us at +233 54 778 3865 or info@tourworldtourism.com.',
  },
  {
    question: 'What is the minimum group size for tours?',
    answer:
      'Most scheduled tours are designed for families or groups of at least 5 people. Custom private itineraries can be arranged for smaller groups on request.',
  },
  {
    question: 'Where are Tourworld Tourism offices located?',
    answer:
      'North Ridge: No. 44, Sixth Avenue, North Ridge, Accra, Ghana (GPS GA-016-7761). Adenta: No. 2 Ayeben Street, Adenta Housing Down, Accra, Ghana (GPS GD-040-1884).',
  },
  {
    question: 'Is Tourworld Tourism a licensed tour operator in Ghana?',
    answer:
      'Yes. Tourworld Tourism is licensed by the Ghana Tourism Authority and is a member of the Tour Operators Union of Ghana.',
  },
]

export const TOURS_FAQ: FaqItem[] = [
  {
    question: 'What types of Ghana tours does Tourworld offer?',
    answer:
      'Culture and heritage, historical tours, eco-tourism, wildlife safaris, adventure activities, and fully customized itineraries across regions including Greater Accra, Ashanti, Central, Volta, and more.',
  },
  {
    question: 'How can I filter tours on the website?',
    answer:
      'Use /tours with query parameters: type (e.g. Culture & Heritage), region (e.g. Greater Accra), or q for keyword search in titles and descriptions.',
  },
  {
    question: 'Are tour prices listed in USD?',
    answer:
      'Tour detail pages show price per person in USD. Final quotes may vary by group size, season, and customization; submit a booking request for confirmation.',
  },
  {
    question: 'Can Tourworld create a custom Ghana itinerary?',
    answer:
      'Yes. Contact the team via /contact or WhatsApp to design a tailored schedule around your dates, interests, and group size.',
  },
]
