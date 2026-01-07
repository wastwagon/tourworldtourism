const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDates() {
  console.log('🧹 Starting comprehensive database date cleanup...');

  try {
    const tours = await prisma.tour.findMany();
    console.log(`🔍 Found ${tours.length} tours to process.`);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Pattern to match date-related strings:
    // 1. " - [Month] [Day], [Year]" or " - [Month] [Year]" or " - [Year]"
    // 2. Just "[Month] [Day], [Year]" or "[Month] [Year]" or "[Year]"
    // 3. " (2025)" or similar
    const dateRegex = new RegExp(`\\s*(-?\\s*(?:(?:${monthNames.join('|')})\\s*(?:\\d{1,2}(?:st|nd|rd|th)?)?,?\\s*)?202\\d)`, 'gi');
    
    // Pattern to match "Tour dates: ..." mentions
    const tourDatesMentionRegex = /Tour dates:.*?(?:\d{4}|\.)/gi;

    for (const tour of tours) {
      let title = tour.title;
      let description = tour.description;
      let notes = tour.notes || '';
      
      // 1. Clean Title
      title = title.replace(dateRegex, '').replace(/\s+-\s*$/, '').trim();
      
      // 2. Clean Description
      description = description.replace(dateRegex, '').replace(tourDatesMentionRegex, '').trim();
      
      // 3. Clean Notes
      notes = notes.replace(dateRegex, '').replace(tourDatesMentionRegex, '').trim();

      // 4. Clear availableDates array
      const updatedAvailableDates = [];

      // 5. Remove 'date' field from itinerary JSON
      let updatedItinerary = tour.itinerary;
      if (Array.isArray(updatedItinerary)) {
        updatedItinerary = updatedItinerary.map(day => {
          if (day.date) {
            const { date, ...rest } = day;
            return rest;
          }
          return day;
        });
      }

      await prisma.tour.update({
        where: { id: tour.id },
        data: {
          title,
          description,
          notes,
          availableDates: updatedAvailableDates,
          itinerary: updatedItinerary,
        },
      });

      console.log(`✅ Cleaned: "${tour.title}" -> "${title}"`);
    }

    // Also clean up Galleries if they have dates in titles
    const galleries = await prisma.gallery.findMany();
    console.log(`🔍 Found ${galleries.length} galleries to process.`);
    for (const gallery of galleries) {
      let title = gallery.title;
      let tourName = gallery.tourName;
      let description = gallery.description || '';

      title = title.replace(dateRegex, '').replace(/\s+-\s*$/, '').trim();
      tourName = tourName.replace(dateRegex, '').replace(/\s+-\s*$/, '').trim();
      description = description.replace(dateRegex, '').trim();

      await prisma.gallery.update({
        where: { id: gallery.id },
        data: {
          title,
          tourName,
          description,
        },
      });
      console.log(`✅ Cleaned gallery: "${gallery.title}" -> "${title}"`);
    }

    console.log('✨ Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDates();
