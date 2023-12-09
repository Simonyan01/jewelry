import { selectCollections, selectLoading, selectActiveLink, switchToActive, selectError, selectModalSrc, seeMoreInfo, getCollections, postCollections } from "../../../../../features/collections/CollectionSlice";
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import { getBeltBoard } from "../../../../../features/board/BoardSlice";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, CircularProgress, Fade, Stack } from "@mui/material"
import { Navigation, Pagination } from 'swiper/modules';
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from "./collection.module.scss"
import { useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';

const CollectionSlider = () => {
    const swiperRef = useRef()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar();

    const error = useSelector(selectError);
    const loading = useSelector(selectLoading);
    const modalSrc = useSelector(selectModalSrc);
    const activeLink = useSelector(selectActiveLink);
    const collections = useSelector(selectCollections);

    const handleClickVariant = (text, variant) => () => {
        enqueueSnackbar(text, { variant });
    };

    useEffect(() => {
        dispatch(getBeltBoard())
        dispatch(getCollections())
    }, [dispatch])

    return (
        <>
            <p className={`${styles.title} pb-8`}>COLLECTION</p>
            {loading ? <CircularProgress /> :
                error ? <p className={styles.title}>Data not found.</p> :
                    <Box className={styles.container}>
                        <ArrowBackIosNewIcon
                            className={`${styles.arrowLeft} arrow-left`}
                            onClick={() => swiperRef.current &&
                                swiperRef.current.swiper.slidePrev()}
                        />
                        <Swiper
                            slidesPerView={6}
                            spaceBetween={30}
                            loop={true}
                            pagination={{ clickable: true }}
                            navigation={{
                                prevEl: '.arrow-left',
                                nextEl: '.arrow-right',
                            }}
                            modules={[Pagination, Navigation]}
                            className="mySwiper select-none"
                        >
                            {collections?.map(({ id, title, img, price, additional }) => (
                                <SwiperSlide key={id} className="h-72">
                                    <Box
                                        ref={swiperRef}
                                        className={`${activeLink === id && styles.active}`}
                                    >
                                        <Box className={styles.card}>
                                            <FavoriteBorderSharpIcon
                                                className={styles.sharpIcon}
                                                onClick={handleClickVariant(`${title} added in Wishlist`, 'success')}
                                            />
                                            <img
                                                src={img}
                                                alt={title}
                                                className={styles.img}
                                                onClick={() => {
                                                    if (dispatch(postCollections({ price, title, img }))) {
                                                        setTimeout(() => dispatch(getBeltBoard()), 1000)
                                                    }
                                                    dispatch(switchToActive(id))
                                                    dispatch(seeMoreInfo(!modalSrc))
                                                }}
                                            />
                                            <Box className={styles.description}>
                                                <span className={styles.cardName}>
                                                    {title}
                                                </span>
                                                <span className={styles.cardPrice}>
                                                    {price}
                                                </span>
                                            </Box>
                                            <Box
                                                className={styles.additional}
                                                onClick={() => dispatch(seeMoreInfo(id))}
                                            >
                                                {additional}
                                                {modalSrc === id && (
                                                    <Fade in={modalSrc}>
                                                        <Stack
                                                            className={styles.modal}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                dispatch(seeMoreInfo(!modalSrc))
                                                            }}
                                                        > Awesome bracelet
                                                        </Stack>
                                                    </Fade>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <ArrowForwardIosIcon
                            className={`${styles.arrowRight} arrow-right`}
                            onClick={() => swiperRef.current &&
                                swiperRef.current.swiper.slideNext()}
                        />
                    </Box>
            }
        </>
    )
}

export default CollectionSlider