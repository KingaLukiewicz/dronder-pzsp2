-- Active: 1765324484348@@127.0.0.1@5432@db
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
('Ortofotomapa', 'format obrazu'), -- geotiff, jpeg, png
--
('Numeryczne', 'GSD'),
('Numeryczne', 'georeferencja zdjęć(nic/RTK/GPS)'),
('Numeryczne', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Numeryczne', 'NMT/NMPT'),
('Numeryczne', 'format obrazu'), --geotiff, jpeg, png
--
('Chmura punktów', 'georeferencja zdjęć(nic/RTK/GPS)'),
('Chmura punktów', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Chmura punktów', 'gęstość punktów na m2'),
('Chmura punktów', 'kolorowa/czarno-biała'),
('Chmura punktów', 'sklasyfikowana/niesklasyfikowana'),
('Chmura punktów', 'format obrazu'), -- obj, laz, pcd, txt, ply
--
('Modele mesh 3D', 'pomiary fotopunktów  (nie/tak/tak z określoną  liczbą fotopunktów)'),
('Modele mesh 3D', 'kolorowa/czarno-biała'),
('Modele mesh 3D', 'rozdzielczość siatki'),
('Modele mesh 3D', 'ilość płaszczyzn'),
('Modele mesh 3D', 'format obrazu'), -- .obj, 3ds, stl, ply, fbx
--
('Skaning laserowy', 'georeferencja zdjęć(nic/RTK/GPS)'), -- RTK
('Skaning laserowy', 'gęstość punktów na m2'),
('Skaning laserowy', 'kolorowa/czarno-biała'),
('Skaning laserowy', 'sklasyfikowana/niesklasyfikowana'),
('Skaning laserowy', 'format obrazu'); -- .obj, laz, pcd, txt, ply
