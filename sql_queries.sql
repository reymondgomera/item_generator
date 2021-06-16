-- Create database
CREATE DATABASE item_generator
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- I going to use "pulic schema"

-- Create categories table
CREATE TABLE public.categories
(
    category_id serial NOT NULL,
    category_name character varying(100) NOT NULL,
    PRIMARY KEY (category_id)
);

-- Insert categories
INSERT INTO public.categories(category_name) VALUES('Electronic Devices');
INSERT INTO public.categories(category_name) VALUES('Electronic Accessories');
INSERT INTO public.categories(category_name) VALUES('Home & Living');
INSERT INTO public.categories(category_name) VALUES('Men''s  Clothing');
INSERT INTO public.categories(category_name) VALUES('Women''s Clothing');

-- Create items table
CREATE TABLE public.items
(
    item_id serial NOT NULL,
    item_name character varying(255) NOT NULL,
    item_quantity integer NOT NULL,
    item_price numeric(12, 2) NOT NULL,
    category_id integer NOT NULL,
    item_desc text NOT NULL,
    item_image character varying(255) NOT NULL,
    "item_createdAt" date NOT NULL,
    "item_updatedAt" date NOT NULL,
    PRIMARY KEY (item_id),
    CONSTRAINT category_id FOREIGN KEY (category_id)
        REFERENCES public.categories (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

-- Insert Items
INSERT INTO public.items(item_name, item_quantity, item_price, category_id, item_desc, 
    item_image, item_createdat, item_updatedat)
    VALUES('Asus-3k', 10, 55000, 1, 'this is a new asus laptop model', 'asus-3k.jpg',
    CURRENT_DATE, CURRENT_DATE);

INSERT INTO public.items(item_name, item_quantity, item_price, category_id, item_desc, 
    item_image, item_createdat, item_updatedat)
    VALUES('Acer-aspire', 20, 45000, 1, 'this is a new acer laptop model', 'Acer-aspire.jpg',
    CURRENT_DATE, CURRENT_DATE);
						
INSERT INTO public.items(item_name, item_quantity, item_price, category_id, item_desc, 
    item_image, item_createdat, item_updatedat)
    VALUES('acer-predator', 20, 75000, 1, 'this is a new acer laptop model', 'acer-predator.jpg',
    CURRENT_DATE, CURRENT_DATE);

-- Create View name item_list in public schema
CREATE VIEW public.item_list AS 
	SELECT i.item_id, i.item_name, i.item_quantity, i.item_price, i.item_desc, c.category_name
		   , i.item_image, i.item_createdat::VARCHAR, i.item_updatedat::VARCHAR
		   FROM public.items AS "i"
		   JOIN public.categories AS "c" ON i.category_id = c.category_id
		   ORDER BY i.item_id;

