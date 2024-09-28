# Sadhana _Vite React JS + swc_ application

## Change Log

_ver. "1.0.0"_
Initial release of PWA application for calculation of active swara according to Shiv Swarodaya shastra.
The application works on the basis of permitted access to the user's location and the exact time of sunrise at that location. Based on the above, it calculates Brahmamuhurta, Tithi (lunar day and bright/dark fortnight), Amavasya, Purnima, Ekadashi and the active swara of the current lunar day.

**PLANIRANJE**
_ver. "1.0.1"_
parsing CSS with Autoprefixer (adds vendor prefixes)
bug fix - na sami dan Amavasye prebacuje se slijedeći datum (prikaz Danas!)
bug fix - lokacija bez broja ulice ili sela .. "undefined"
bug fix - ekadashi ne radi dobro, prije kraja mj. pokazuje ne slijedeći period nego onaj iza ..

_"1.1.1"_
Dodati **notifikacije** za post i švaru
Dodati opise svih kartica
Dodati Festivale
Dodati asanaPlaner ???

## Notes for calculations

### Tithi calculation

Tithi is a lunar day which is approximately 1/30th of the time it takes the Moon to orbit the Earth. Thus Tithi is a period in which the difference between the longitudes of Moon and Sun is exactly 12°. Tithi may begin at varying times of the day and may also vary in duration from approximately 19 to 26 hours.

A particular day is ruled by the Tithi prevailed on that day at sunrise time, but the Tithi can change anytime of the day or night as it is not based on the solar day but on the situation of the Moon in relation to the Sun.

### Ekadashi calculation

On the eleventh day of each lunar cycle, the moon forms a trine with the earth and the sun during which the distance between the moon and sun is in the range of 120-132 degrees on Shulka Ekadashi and in a range of 300-312 degrees on Krishna Ekadashi.

### Shiv Swarodaya shastra (63-64 verse)

During the first three days of “Shuklapaksha” (the bright fortnight), the Ida flows and then alternates. (1st,2nd,3rd-IDA, 4th,5th,6th Pingla, thus they keep alternating). While, conversely, during the first three days of “Krishnapaksha” (the dark fortnight), the Pingala flows first. (1st,2nd,3rd PINGLA, 4th 5th,6th IDA thus they alternate).

In the bright fortnight, the lunar swara (Ida) rises from the time of sunrise and continues till the time span of two & a half Ghadis (60 minutes). In the dark fortnight, the solar Swara (Pingala) rises first. So, these swaras flow alternately for a period of two-and-a half ghadis (60 minutes) throughout the twenty four hours of a day.
