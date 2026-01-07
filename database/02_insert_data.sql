-- Active: 1765324484348@@127.0.0.1@5432@db
BEGIN;


INSERT INTO public."Weekdays" (weekday) VALUES
('Poniedziałek'),
('Wtorek'),
('Środa'),
('Czwartek'),
('Piątek'),
('Sobota'),
('Niedziela');


INSERT INTO public."Offer_Types" (name) VALUES
('Ortofotomapa'),
('Numeryczne'),
('Chmura punktów'),
('Modele mesh 3D'),
('Skaning laserowy');


INSERT INTO public."Parameters" (name) VALUES
('GSD'),
('georeferencja zdjęć'),
('pomiary fotopunktów'),
('gęstość punktów na m2'),
('NMT/NMPT'),
('kolorowa/czarno-biała'),
('sklasyfikowana/niesklasyfikowana'),
('rozdzielczość siatki'),
('ilość płaszczyzn'),
('format obrazu');


INSERT INTO public."Type_Parameters" (type_name, parameter_name) VALUES
('Ortofotomapa', 'GSD'),
('Ortofotomapa', 'georeferencja zdjęć'),
('Ortofotomapa', 'pomiary fotopunktów'),
('Ortofotomapa', 'format obrazu'),                                                                      -- geotiff, jpeg, png
--
('Numeryczne', 'GSD'),
('Numeryczne', 'georeferencja zdjęć'),
('Numeryczne', 'pomiary fotopunktów'),
('Numeryczne', 'NMT/NMPT'),
('Numeryczne', 'format obrazu'),                                                                        -- geotiff, jpeg, png
--
('Chmura punktów', 'georeferencja zdjęć'),
('Chmura punktów', 'pomiary fotopunktów'),
('Chmura punktów', 'gęstość punktów na m2'),
('Chmura punktów', 'kolorowa/czarno-biała'),
('Chmura punktów', 'sklasyfikowana/niesklasyfikowana'),
('Chmura punktów', 'format obrazu'),                                                                    -- obj, laz, pcd, txt, ply
--
('Modele mesh 3D', 'pomiary fotopunktów'),
('Modele mesh 3D', 'kolorowa/czarno-biała'),
('Modele mesh 3D', 'rozdzielczość siatki'),
('Modele mesh 3D', 'ilość płaszczyzn'),
('Modele mesh 3D', 'format obrazu'),                                                                    -- .obj, 3ds, stl, ply, fbx
--
('Skaning laserowy', 'georeferencja zdjęć'),                                               -- RTK
('Skaning laserowy', 'gęstość punktów na m2'),
('Skaning laserowy', 'kolorowa/czarno-biała'),
('Skaning laserowy', 'sklasyfikowana/niesklasyfikowana'),
('Skaning laserowy', 'format obrazu');                                                                  -- .obj, laz, pcd, txt, ply


INSERT INTO public."Groups" (client, operator, admin) VALUES
(False, False, True),
(False, True, False),
(True, False, False),
(True, True, False);


INSERT INTO public."Locations" (geo_longitude, geo_latitude, radius, address) VALUES
(21.0059, 52.2319, 50, Null),                                                                           -- operator's service area
(Null, Null, Null, 'Plac Defilad 1, 00-901 Warszawa, Polska'),
(19.9445, 50.0647, 40, NULL),                                   -- Kraków service area
(NULL, NULL, NULL, 'ul. Długa 15, 31-147 Kraków, Polska'),
(18.6466, 54.3520, 60, NULL),                                   -- Gdańsk service area
(NULL, NULL, NULL, 'ul. Grunwaldzka 101, 80-244 Gdańsk, Polska');


INSERT INTO public."Users" (email, username, password, phone_number, location_id, group_id) VALUES
('marian_maleczko@gmail.com', 'marian_super_oprator', 'drony4life', 123456789, 1, 2),
('kasia_michalska@gmail.com', 'katarzyna_michalska', 'zlotarybka', 987654321, Null, 3);
INSERT INTO public."Users" (email, username, password, description, phone_number, location_id, group_id) VALUES
('adam_kowalczyk@gmail.com', 'adam_drontech', 'haslo123', 'Operator UAV z 5-letnim doświadczeniem', '555111222', 3, 2),
('ewa_nowak@gmail.com', 'ewa_inwestor', 'bezpiecznehaslo', 'Inwestor nieruchomości', '555333444', 4, 3),
('piotr_zielinski@gmail.com', 'piotr_3d_scan', 'scanmaster', 'Specjalista od skaningu laserowego', '555666777', 5, 2),
('magda_lewandowska@gmail.com', 'magda_geo', 'geo2025', 'Geodetka i operator UAV', '555888999', 6, 4);


INSERT INTO public."Available_Weekdays" (weekday, operator_id) VALUES
('Poniedziałek', 1),
('Wtorek', 1),
('Środa', 1),
('Czwartek', 1),
('Piątek', 1),
('Sobota', 1),
('Niedziela', 1),

('Poniedziałek', 3),
('Wtorek', 3),
('Czwartek', 3),
('Piątek', 3),

('Środa', 5),
('Czwartek', 5),
('Piątek', 5),

('Poniedziałek', 6),
('Wtorek', 6),
('Środa', 6),
('Sobota', 6);


INSERT INTO public."Offers" (location_id, client_id, match_id, offer_type, description, deadline_date, status, format, flight_date)
VALUES(
    2,                                                                                                  -- location_id
    1,                                                                                                  -- client_id
    NULL,                                                                                               -- match_id
    'Ortofotomapa',                                                                                     -- offer_type
    'Zlecenie wykonania zdjęć lotniczych dla nieruchomości.',                                           -- description
    '2025-01-15',                                                                                       -- deadline_date
    'oczekujące',                                                                                       -- status
    'geotiff',                                                                                          -- format
    Null                                                                                                -- flight_date
),
(
    4,
    2,
    NULL,
    'Chmura punktów',
    'Chmura punktów dla terenu inwestycyjnego 4 ha.',
    '2025-02-10',
    'oczekujące',
    'laz',
    NULL
),
(
    6,
    4,
    NULL,
    'Skaning laserowy',
    'Skaning laserowy elewacji zabytkowego budynku.',
    '2025-01-30',
    'w trakcie',
    'ply',
    '2025-01-20'
),
(
    2,
    2,
    NULL,
    'Modele mesh 3D',
    'Model 3D dachu pod instalację fotowoltaiczną.',
    '2025-02-05',
    'zakończone',
    'obj',
    '2025-01-18'
);
INSERT INTO public."Offers" (location_id, client_id, match_id, offer_type, description, deadline_date, status, format, flight_date, client_rating, client_review, operator_rating, operator_review)
VALUES
(
    2,
    2,
    NULL,
    'Ortofotomapa',
    'Ortofotomapa działki pod zabudowę jednorodzinną.',
    '2024-09-15',
    'zakończone',
    'geotiff',
    '2024-09-08',
    5,
    'Klient bardzo dobrze przygotowany, sprawna komunikacja.',
    5,
    'Bardzo dokładna ortofotomapa, szybka realizacja.'
),
(
    4,
    2,
    NULL,
    'Modele mesh 3D',
    'Model 3D budynku mieszkalnego.',
    '2024-08-20',
    'zakończone',
    'obj',
    '2024-08-14',
    4,
    'Niewielkie zmiany w trakcie realizacji, ale współpraca OK.',
    4,
    'Dobry model, drobne poprawki wykonane szybko.'
),
(
    2,
    4,
    NULL,
    'Chmura punktów',
    'Chmura punktów do analizy objętości mas ziemnych.',
    '2024-10-05',
    'zakończone',
    'laz',
    '2024-09-27',
    5,
    'Jasne wymagania techniczne, bardzo dobra współpraca.',
    5,
    'Gęsta i dobrze sklasyfikowana chmura punktów.'
),
(
    6,
    4,
    NULL,
    'Skaning laserowy',
    'Skaning laserowy elewacji kamienicy.',
    '2024-11-10',
    'zakończone',
    'ply',
    '2024-11-02',
    4,
    'Trudne warunki terenowe, ale klient elastyczny.',
    5,
    'Profesjonalne podejście, świetna jakość danych.'
),
(
    2,
    2,
    NULL,
    'Numeryczne',
    'Numeryczny model terenu dla projektu drogowego.',
    '2024-12-01',
    'zakończone',
    'geotiff',
    '2024-11-22',
    5,
    'Dokumentacja kompletna, brak problemów.',
    4,
    'Model zgodny z wymaganiami, dobry kontakt.'
);


INSERT INTO public."Offer_Parameters" (offer_id, parameter_id, value) VALUES
(1, 'GSD', '2 cm'),
(1, 'georeferencja zdjęć', 'RTK'),
(1, 'pomiary fotopunktów', 'tak, 8 fotopunktów'),
(1, 'format obrazu', 'geotiff'),

(2, 'gęstość punktów na m2', '200 pkt/m2'),
(2, 'kolorowa/czarno-biała', 'kolorowa'),
(2, 'sklasyfikowana/niesklasyfikowana', 'sklasyfikowana'),
(2, 'format obrazu', 'laz'),

(3, 'georeferencja zdjęć', 'RTK'),
(3, 'gęstość punktów na m2', '500 pkt/m2'),
(3, 'format obrazu', 'ply'),

(4, 'rozdzielczość siatki', '1 cm'),
(4, 'ilość płaszczyzn', '12'),
(4, 'kolorowa/czarno-biała', 'kolorowa'),
(4, 'format obrazu', 'obj');

INSERT INTO public."Matches" (operator_id, offer_id, status) VALUES
(1, 1, 'pending'),
(3, 2, 'interested'),
(5, 3, 'matched'),
(6, 4, 'finalized'),
(1, 5, 'finalized'),
(1, 6, 'finalized'),
(1, 7, 'finalized'),
(1, 8, 'finalized'),
(1, 9, 'finalized');



UPDATE public."Offers"
SET
    operator_rating = 5,
    operator_review = 'Bardzo dobra współpraca, precyzyjne dane.',
    client_rating = 5,
    client_review = 'Klient dobrze przygotowany, jasne wymagania.'
WHERE offer_id = 4;

END;