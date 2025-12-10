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
('georeferencja zdjęć(nic/RTK/GPS)'),
('pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('gęstość punktów na m2'),
('NMT/NMPT'),
('kolorowa/czarno-biała'),
('sklasyfikowana/niesklasyfikowana'),
('rozdzielczość siatki'),
('ilość płaszczyzn'),
('format obrazu');


INSERT INTO public."Type_Parameters" (type_name, parameter_name) VALUES
('Ortofotomapa', 'GSD'),
('Ortofotomapa', 'georeferencja zdjęć(nic/RTK/GPS)'),
('Ortofotomapa', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Ortofotomapa', 'format obrazu'),                                                                      -- geotiff, jpeg, png
--
('Numeryczne', 'GSD'),
('Numeryczne', 'georeferencja zdjęć(nic/RTK/GPS)'),
('Numeryczne', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Numeryczne', 'NMT/NMPT'),
('Numeryczne', 'format obrazu'),                                                                        --geotiff, jpeg, png
--
('Chmura punktów', 'georeferencja zdjęć(nic/RTK/GPS)'),
('Chmura punktów', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Chmura punktów', 'gęstość punktów na m2'),
('Chmura punktów', 'kolorowa/czarno-biała'),
('Chmura punktów', 'sklasyfikowana/niesklasyfikowana'),
('Chmura punktów', 'format obrazu'),                                                                    -- obj, laz, pcd, txt, ply
--
('Modele mesh 3D', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Modele mesh 3D', 'kolorowa/czarno-biała'),
('Modele mesh 3D', 'rozdzielczość siatki'),
('Modele mesh 3D', 'ilość płaszczyzn'),
('Modele mesh 3D', 'format obrazu'),                                                                    -- .obj, 3ds, stl, ply, fbx
--
('Skaning laserowy', 'georeferencja zdjęć(nic/RTK/GPS)'),                                               -- RTK
('Skaning laserowy', 'gęstość punktów na m2'),
('Skaning laserowy', 'kolorowa/czarno-biała'),
('Skaning laserowy', 'sklasyfikowana/niesklasyfikowana'),
('Skaning laserowy', 'format obrazu');                                                                  -- .obj, laz, pcd, txt, ply


INSERT INTO public."Groups" (client, operator, admin) VALUES
(False, True, False),
(True, False, False);


INSERT INTO public."Locations" (geo_longitude, geo_latitude, radius, address) VALUES
(21.0059, 52.2319, 50, Null),                                                                           -- operator's service area
(Null, Null, Null, 'Plac Defilad 1, 00-901 Warszawa, Polska');                                          -- address of the offer


INSERT INTO public."Users" (email, username, password, phone_number, location_id, group_id) VALUES
('marian_maleczko@gmail.com', 'marian_super_oprator', 'drony4life', 123456789, 1, 1),                   -- operator
('kasia_michalska@gmail.com', 'katarzyna_michalska', 'zlotarybka', 987654321, Null, 2);                 -- client


INSERT INTO public."Available_Weekdays" (weekday, operator_id) VALUES
('Poniedziałek', 1),
('Wtorek', 1),
('Środa', 1),
('Czwartek', 1),
('Piątek', 1),
('Sobota', 1),
('Niedziela', 1);


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
);


INSERT INTO public."Offer_Parameters" (offer_id, parameter_id, value) VALUES
(1, 'GSD', '2 cm'),
(1, 'georeferencja zdjęć(nic/RTK/GPS)', 'RTK'),
(1, 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)', 'tak, 8 fotopunktów'),
(1, 'format obrazu', 'geotiff');  


INSERT INTO public."Matches" (operator_id, offer_id) VALUES
(1, 1);


END;