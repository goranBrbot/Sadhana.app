# Sadhana _Vite React JS + swc_ application

## Change Log

_ver. "1.0.0"_
Initial release of PWA application for calculation of active swara according to Shiv Swarodaya shastra.
The application works on the basis of permitted access to the user's location and the exact time of sunrise at that location. Based on the above, it calculates Brahmamuhurta, Tithi (lunar day and bright/dark fortnight), Amavasya, Purnima, Ekadashi and the active swara of the current lunar day.

**PLANIRANJE**
_"1.1.1"_

- Dodati **notifikacije**
- Dodati asanaPlaner ???
- Odbrojavanje do promjene sware

## Notes for calculations

### Tithi calculation

Tithi is a lunar day which is approximately 1/30th of the time it takes the Moon to orbit the Earth. Thus Tithi is a period in which the difference between the longitudes of Moon and Sun is exactly 12°. Tithi may begin at varying times of the day and may also vary in duration from approximately 19 to 26 hours.

A particular day is ruled by the Tithi prevailed on that day at sunrise time, but the Tithi can change anytime of the day or night as it is not based on the solar day but on the situation of the Moon in relation to the Sun.

### Ekadashi calculation

On the eleventh day of each lunar cycle, the moon forms a trine with the earth and the sun during which the distance between the moon and sun is in the range of 120-132 degrees on Shulka Ekadashi and in a range of 300-312 degrees on Krishna Ekadashi.

### Shiv Swarodaya shastra (63-64 verse)

During the first three days of “Shuklapaksha” (the bright fortnight), the Ida flows and then alternates. (1st,2nd,3rd-IDA, 4th,5th,6th Pingla, thus they keep alternating). While, conversely, during the first three days of “Krishnapaksha” (the dark fortnight), the Pingala flows first. (1st,2nd,3rd PINGLA, 4th 5th,6th IDA thus they alternate).

In the bright fortnight, the lunar swara (Ida) rises from the time of sunrise and continues till the time span of two & a half Ghadis (60 minutes). In the dark fortnight, the solar Swara (Pingala) rises first. So, these swaras flow alternately for a period of two-and-a half ghadis (60 minutes) throughout the twenty four hours of a day.

### Opis svega

The application works based on the allowed access to the user location. By granting access to the user location, current data on the geographic latitude and longitude of that location is obtained. Taking into account the obtained location, the current sunrise and sunset visible from that location are calculated.

After calculating the sunrise by subtracting 96 minutes from the sunrise we calculate the Brahmamuhurta time lasting 48 minutes.

Then we calculate the Tithi (lunar day and bright Shukla Pakṣa - dark Kṛṣṇa Navamī fortnight) which is approximately 1/30th of the time it takes the Moon to go around the Earth, i.e. the period in which the difference between the longitudes of the Moon and the Sun is exactly 12°. A Tithi can start at different times of the day and can also vary in duration from approximately 19 to 26 hours so a particular day is governed by the Tithi prevailing on that day at the time of sunrise, but it can change at any time of the day or night as it is not based on a solar day, but on the position of the Moon in relation to the Sun.

The above calculations are the basis for further calculations of other application possibilities.

We calculate the active swara (dominant nostril) with which the current lunar day begins at sunrise based on verses 63-64 of Shiv Swarodaya shastra.
During the first three days of “Shuklapaksha” (the bright fortnight), the Ida flows and then alternates. (1st,2nd,3rd-IDA, 4th,5th,6th Pingla, thus they keep alternating). While,conversely, during the first three days of “Krishnapaksha” (the dark fortnight), the Pingala flows first. (1st,2nd,3rd PINGLA, 4th 5th,6th IDA thus they alternate).
In the bright fortnight, the lunar swara (Ida) rises from the time of sunrise and continues till the time span of two & a half Ghadis (60 minutes). In the dark fortnight, the solar Swara (Pingala) rises first. So, these swaras flow alternately for a period of two-and-a half ghadis (60 minutes) throughout the twenty four hours of a day.

Here are three main lunar phases for fasting.
Amāvásyā is the lunar phase of the new moon and Pūrṇimā is the lunar phase of the full moon.
While on the eleventh day of each lunar cycle, the Moon forms a trine with the Earth and the Sun during which the distance between the Moon and the Sun is in the range of 120-132 degrees on Shukla Pakṣa Ekadashi and in the range of 300-312 degrees on Kṛṣṇa Pakṣa Ekadashi. Therefore, Ēkādaśī is the eleventh lunar day (tithi) in the waxing (Shukla Pakṣa) and waning (Kṛṣṇa Pakṣa) lunar cycle.
