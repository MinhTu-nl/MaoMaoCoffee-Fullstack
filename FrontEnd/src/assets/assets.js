import LOGO from './LOGO.png'
import LOGO2 from './LOGO2.png'
import cart_icon from "./cart_icon.png"
import bin_icon from "./bin_icon.png"
import dropdown_icon from "./dropdown_icon.png"
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
// import about_img from './about_img.png'
// import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'

import cb1 from './CB01.png'
import cb2 from './CB02.png'
import cb3 from './CB03.png'
import cb4 from './CB04.png'
import cb5 from './CB05.png'

import cf1 from './CF1.png'
import cf2 from './CF2.png'
import cf3 from './CF3.png'
import cf4 from './CF4.png'
// import cf5 from './CF5.png'
import cf6 from './CF6.png'
import cf7 from './CF7.png'
import cf8 from './CF8.png'
import cf9 from './CF9.png'
import cf10 from './CF10.png'

import cr1 from './CRO1.png'
import cr2 from './CRO2.png'
import cr3 from './CRO3.png'
import cr4 from './CRO4.png'

// import des1 from './DES1.png'
// import des2 from './DES2.png'
// import des3 from './DES3.png'
// import des4 from './DES4.png'

import dx1 from './DX01.png'
import dx2 from './DX02.png'
import dx3 from './DX03.png'
import dx4 from './DX04.png'
import dx5 from './DX05.png'
import dx6 from './DX06.png'
import dx7 from './DX07.png'
import dx8 from './DX08.png'
import dx9 from './DX09.png'

import t1 from './T01.png'
import t2 from './T02.png'
import t3 from './T03.png'
import t4 from './T04.png'
import t5 from './T05.png'
import t6 from './T06.png'
import t7 from './T07.png'
import t8 from './T08.png'
import t10 from './T10.png'
import t11 from './T11.png'

import toa1 from './TOA1.png'
import toa2 from './TOA2.png'
import toa3 from './TOA3.png'
import toa4 from './TOA4.png'
import toa5 from './TOA5.png'
import toa6 from './TOA6.png'
import toa7 from './TOA7.png'

import ts1 from './TS01.png'
import ts2 from './TS02.png'
import ts3 from './TS03.png'
import ts4 from './TS04.png'
import ts5 from './TS05.png'
import ts6 from './TS06.png'
import ts7 from './TS07.png'
import ts8 from './TS08.png'

export const assets = {
    LOGO,
    LOGO2,
    // hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    // about_img,
    // contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon
}

export const products = [
    {
        _id: 'coldbrew5',
        name: 'CÀ PHÊ SỮA',
        description: 'Cà phê Coldbrew, Sữa đặc, Richs',
        price: 47000,
        image: [cb1],
        category: 'coldbrew',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'coldbrew1',
        name: 'CÀ PHÊ VỊ VẢI',
        description: 'Cà phê Coldbrew, Syrup vải',
        price: 45000,
        image: [cb2],
        category: 'coldbrew',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'coldbrew2',
        name: 'TRUYỀN THỐNG',
        description: 'Cà phê Coldbrew',
        price: 43000,
        image: [cb3],
        category: 'coldbrew',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'coldbrew3',
        name: 'TRÀ SỮA TRÂN CHÂU Ử LẠNH',
        description: 'Trà hoa hồng, Sữa tươi, Sữa đặc, Trân châu trắng',
        price: 48000,
        image: [cb4],
        category: 'coldbrew',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'coldbrew4',
        name: 'TRẰ SỮA HONGKONG',
        description: 'Trà đen, Sữa tươi, sữa đặc',
        price: 48000,
        image: [cb5],
        category: 'coldbrew',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'cf1',
        name: 'CÀ PHÊ GIA LAI',
        description: 'Cà phê đen Gia Lai, đường, Espreso',
        price: 32000,
        image: [cf2],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf2',
        name: 'CỘNG HOÀ ĐEN ĐÁ',
        description: 'Cà phê đen Arabica, đường, Espreso',
        price: 34,
        image: [cf2],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: true
    },
    {
        _id: 'cf3',
        name: 'CÀ PHÊ GIA LAI SỮA ĐÁ',
        description: 'Cà phê đen Gia Lai, Sữa đặc',
        price: 35000,
        image: [cf8],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf4',
        name: 'CÀ PHÊ CỘNG HOÀ SỮA ĐÁ',
        description: 'Arabica Espresso, Sữa đặc',
        price: 37000,
        image: [cf1],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf5',
        name: 'SỮA TƯƠI CÀ PHÊ',
        description: 'Cà phê đen Gia Lai, Sữa tươi, nước đường',
        price: 29000,
        image: [cf7],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf6',
        name: 'CAPUCCHINO',
        description: 'Aribica Espresso, Sữa tươi',
        price: 33000,
        image: [cf6],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf7',
        name: 'LATTE',
        description: 'Aribica Espresso',
        price: 45000,
        image: [cf4],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf8',
        name: 'CÀ PHÊ SA PA',
        description: 'Arabica Espresso, sữa đặc, kem béo, Richs',
        price: 26000,
        image: [cf9],
        category: 'coffee',
        subCategory: 'drink',
        size: ['S'],
        bestSeller: false
    },
    {
        _id: 'cf8',
        name: 'MOCHA',
        description: 'Arabica Espresso, sữa tươi, sốt socola',
        price: 41000,
        image: [cf3],
        category: 'coffee',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'cf9',
        name: 'ICED CARAMEL / HAZELNUT MACCHIATO',
        description: 'Arabica Espresso, sữa tươi, sốt Caramel / Syrup Hazelnut',
        price: 41000,
        image: [cf10],
        category: 'coffee',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 't1',
        name: 'TRÀ VẢI',
        description: 'Trà lài, Syprup vải, thạch trà',
        price: 38,
        image: [t1],
        category: 'tea',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 't2',
        name: 'TRÀ ĐÀO',
        description: 'Trà lài, Syrup đào, miếng đào, thạch trà',
        price: 38000,
        image: [t2],
        category: 'tea',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 't3',
        name: 'TRÀ TÁO',
        description: 'Trà lài, Syrup táo, miếng táo tươi, thạch trà',
        price: 38000,
        image: [t3],
        category: 'tea',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 't4',
        name: 'TRÀ LÀI THƠM CHANH DÂY',
        description: 'Trà lài, Eps thơm, Nước chanh dây Nha đam',
        price: 38000,
        image: [t4],
        category: 'tea',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 't5',
        name: 'TRÀ OOLONG DÂU DĂM',
        description: 'Trà King oolong, Mứt dâu dằm. Nha đam',
        price: 38000,
        image: [t5],
        category: 'tea',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 't6',
        name: 'TRÀ MÃNG CẦU',
        description: ' Trà King Oolong Mứt, mãng cầu Mãng cầu tươi sên đường',
        price: 47000,
        image: [t6],
        category: 'tea',
        subCategory: 'drink',
        size: ['L'],
        bestSeller: false
    },
    {
        _id: 't7',
        name: 'TRÀ NHÃN MẬT ONG',
        description: 'Trà lài, Syrup Nhãn, Mật ong. Trái nhãn',
        price: 40,
        image: [t7],
        category: 'tea',
        subCategory: 'drink',
        size: ['L'],
        bestSeller: false
    },
    {
        _id: 't8',
        name: 'TRÀ OOLONG',
        description: 'Trà King Oolong, Nước đường',
        price: 38000,
        image: [t8],
        category: 'tea',
        subCategory: 'drink',
        size: ['L'],
        bestSeller: false
    },
    {
        _id: 't9',
        name: 'TRÀ HOA HÔNG',
        description: 'Trà hoa hồng, Nước đường',
        price: 30000,
        image: [t10],
        category: 'tea',
        subCategory: 'drink',
        size: ['L'],
        bestSeller: false
    },
    {
        _id: 't10',
        name: 'TRÀ LÀI',
        description: 'Trà lài, nước đường',
        price: 26000,
        image: [t11],
        category: 'tea',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'ts1',
        name: 'TRÀ SỮA KING OOLONG',
        description: 'Trà King Oolong, Sữa đặc. Sữa béo, Váng sữa',
        price: 37000,
        image: [ts1],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'ts2',
        name: 'TRÀ SỮA VỚ HONGKONG',
        description: 'Trà đen, Sữa đặc, Sữa béo',
        price: 41000,
        image: [ts2],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },

    {
        _id: 'ts3',
        name: 'TRÀ SỮA LÀI THÁI NGUYÊN',
        description: 'Trà lài, Sữa đặc, Sữa béo',
        price: 35000,
        image: [ts3],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'ts4',
        name: 'TRÀ SỮA THÁI',
        description: 'Trà thái, Sữa đặc, Sữa béo',
        price: 40000,
        image: [ts4],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'ts5',
        name: 'TRÀ HOA HỒNG VÁNG SỮA',
        description: 'Trà hoa hồng, nước đường, váng sữa',
        price: 45000,
        image: [ts5],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'ts6',
        name: 'MILO VÁNG SỮA',
        description: 'Milo, Sữa tươi, váng sữa',
        price: 38000,
        image: [ts6],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'ts7',
        name: 'SỮA TƯƠI TRÂN CHÂU ĐƯỜNG ĐEN',
        description: 'Sữa tươi, trân châu đường đen',
        price: 41000,
        image: [ts7],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'ts8',
        name: 'SỮA TƯƠI LAVA TRỨNG MUỐI',
        description: 'Sữa tươi, sốt lava trứng muối, trân châu đường đen',
        price: 47000,
        image: [ts8],
        category: 'milk',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx1',
        name: 'PHÔ MAI ĐÁ XAY VIỆT QUẤT',
        description: 'Sữa tươi, Phô mai tươi, sữa đặc, mứt việt quất',
        price: 67000,
        image: [dx1],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'dx2',
        name: 'PHÔ MAI ĐÁ XAY CARAMEL',
        description: 'Sữa tươi, Phô mai tươi, sữa đặc, sốt caramel',
        price: 61000,
        image: [dx2],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx3',
        name: 'PHÔ MAI ĐÁ XAY SOCOLA',
        description: 'Sữa tươi, Phô mai tươi, sữa đặc, sốt socola',
        price: 69000,
        image: [dx3],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx4',
        name: 'TRÀ XANH ĐÁ XAY',
        description: 'Sữa tươi, Bột trà xanh, Syrup trà xanh, Sữa đặc, Kem Whip',
        price: 59000,
        image: [dx4],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx5',
        name: 'COOKIES & CREAM ĐÁ XAY',
        description: 'Sữa tươi, Bánh oreo, sữa đặc, kem whip',
        price: 59000,
        image: [dx5],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx6',
        name: 'CARAMEL CÀ PHÊ ĐÁ XAY',
        description: 'Cà phê Espresso, Sữa tươi. Sữa đặc, Sốt caramel, Kem whip',
        price: 57000,
        image: [dx6],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx7',
        name: 'TRÀ SỮA BÁNH PLAN ĐÁ XAY',
        description: 'Trà đen, Sữa đặc, Bánh flan',
        price: 67000,
        image: [dx7],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx8',
        name: 'SINH TỐ DÂU BERRIES',
        description: 'Dâu tươi. Sữa chua Nước đường',
        price: 55000,
        image: [dx8],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'dx9',
        name: 'SINH TỐ XOÀI TANGO',
        description: 'Xoài tươi. Mứt chanh dây Nước đường',
        price: 57000,
        image: [dx9],
        category: 'ice',
        subCategory: 'drink',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'cro1',
        name: 'CROFFLE BƠ CLASSIC',
        description: 'Bánh Croffle, Bơ lạt, Đường bột',
        price: 37000,
        image: [cr1],
        category: 'croffle',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'cro2',
        name: 'CROFFLE BERRIES CREAMY',
        description: 'Bánh Croffle, Sốt cheese, Dâu tươi. Mứt việt quất, Đường bột',
        price: 47000,
        image: [cr2],
        category: 'croffle',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'cro3',
        name: 'CROFFLE CINNAMON CARAMEL',
        description: 'Bánh Croffle,Bột quế, Sốt caramel, Đường bột',
        price: 39000,
        image: [cr3],
        category: 'croffle',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'cro4',
        name: 'CROFFLE TRỨNG MUỐI LAVA',
        description: 'Bánh Croffle, Sốt cheese . Sốt lava, Chà bông, Trứng muối tươi',
        price: 47000,
        image: [cr4],
        category: 'croffle',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'toa1',
        name: 'BÁNH TOAST, SỐT LAVA, TRỨNG MUỐI',
        description: 'Bánh toast nướng, Sốt Lava trứng muối',
        price: 51000,
        image: [toa1],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'toa2',
        name: 'BÁNH TOAST, PHÔ MAI TRỨNG MUỐI, HOÀNG KIM',
        description: 'Bánh toast nướng, Sốt Lava trứng muối',
        price: 58000,
        image: [toa2],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: true
    },
    {
        _id: 'toa3',
        name: 'BÁNH TOAST DÂU BERRIES',
        description: 'Bánh toast nướng, Sốt cheese và dâu, Việt quất tươi. Dâu tươi, Pudding việt quất',
        price: 58000,
        image: [toa3],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'toa4',
        name: 'BÁNH TOAST XOÀI TANGO',
        description: 'Bánh toast nướng, Sốt cheese và mứt xoài, Kiwi tươi. Xoài tươi, Pudding xoài',
        price: 58000,
        image: [toa4],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'toa5',
        name: 'BÁNH TOAST SOCOLA TRUFFLE',
        description: 'Bánh toast nướng, Sốt cheese socola, Hạnh nhân nướng, Bánh biscof',
        price: 51000,
        image: [toa5],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'toa7',
        name: 'BÁNH TOAST PHÔ MAI CHEESY',
        description: 'Bánh toast nướng, Sốt cheese. Phô mai tươi, Hạnh nhân nướng',
        price: 58000,
        image: [toa6],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
    {
        _id: 'toa8',
        name: 'BÁNH TOAST TRÀ SỮA THÁI',
        description: 'Bánh toast nướng, Sốt trà sữa Thái, Hạnh nhân nướng & Oreo',
        price: 58000,
        image: [toa7],
        category: 'toast',
        subCategory: 'dessert',
        size: ['M'],
        bestSeller: false
    },
]