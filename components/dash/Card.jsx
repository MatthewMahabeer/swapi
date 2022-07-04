import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { personAtom } from "./Cards";
import { useAtom } from "jotai";
import { useQueries, useQuery } from "react-query";
import { getVehicle } from "../../pages/api/apiHandler";
import { Grid } from 'react-loader-spinner';
import { isEmpty } from "lodash";



const Card = () => {

    const [person] = useAtom(personAtom);

    const { isLoading, isError, error, data } = useQuery(
        [person.name], async () => await fetch(person.url).then(res => res.json()),
    );

    const { isLoading: specieplaneLoading, isError: specieError, error: specieErrorMessage, data: specieData } = useQuery(
        ['specie', person.name], async () => fetch(data.species[0]).then(res => res.json()),
        {
            enabled: !isLoading && data.species.length > 0,
            retry: 1,
        }
    );

    const { isLoading: homeworldLoading, isError: homeworldError, error: homeworldErrorMessage, data: homeworldData } = useQuery(
        ['homeworld', person.name], async () => fetch(person.homeworld).then(res => res.json()),
        {
            enabled: !isLoading && data.homeworld !== '',
            retry: 1,
        }
    );

    const vehicleQueries = useQueries(
        person?.vehicles.map(v => {
            return {
                queryKey: ['vehicles', v],
                queryFn: async () => await fetch(v).then(res => res.json()),
                enabled: data && !isLoading && data.vehicles > 0,
            }
        }),
    );

    const starshipQueries = useQueries(
        person.starships.map(ss => {
            return {
                queryKey: ['starships', ss],
                queryFn: async () => await fetch(ss).then(res => res.json()),
                enabled: data && !isLoading && data.starships > 0,
            }
        })
    );

    if (isLoading) {
        return <div className={styles.loader}><Grid ariaLabel='loading-indicator' type="TailSpin" color="#00BFFF" height={100} width={100} /></div>
    }

    return (
        <div className={styles.cardcomp2}>
            <div className={styles.cardtop2}>
                <div className={styles.cardtitle}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <svg style={{ alignSelf: "flex-start" }} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_12_2576)">
                                <path d="M10 12.5V9.99998C10 9.60216 9.84196 9.22063 9.56066 8.93932C9.27936 8.65802 8.89782 8.49998 8.5 8.49998V8.49998C8.10218 8.49998 7.72064 8.65802 7.43934 8.93932C7.15804 9.22063 7 9.60216 7 9.99998V13.5C7.05225 14.001 7.21362 14.4844 7.47277 14.9163C7.73192 15.3482 8.08255 15.7181 8.5 16H12L13.348 11.508C13.4473 11.1749 13.4587 10.8218 13.381 10.483L12.181 5.27398C12.0663 4.77664 11.7658 4.34196 11.341 4.05898L10.5 3.49998" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.5 6.99998V0.999985H2.5V12H4.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_12_2576">
                                    <rect width="16" height="16" fill="white" transform="translate(0 0.499985)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <div className={styles.deckselector}>
                            <svg className={styles.svgdeckselector} width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1.49998V11.5" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 6.49998H11" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className={styles.cardname}>
                    {data.name}
                </div>
            </div>
            <div className={styles.specierow}>
                <svg className={styles.speciesvg} width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.125 1.625H10.875V5.375" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.875 1.625L6.88647 5.6135" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 11.375C6.36396 11.375 7.875 9.86396 7.875 8C7.875 6.13604 6.36396 4.625 4.5 4.625C2.63604 4.625 1.125 6.13604 1.125 8C1.125 9.86396 2.63604 11.375 4.5 11.375Z" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className={styles.specietype}>
                    {data.birth_year}
                </div>
                {specieplaneLoading ? <p className={styles.species}>Loading...</p> :
                    !specieplaneLoading && specieData == undefined ?
                        <div className={styles.species}>N/A</div> :
                        !specieplaneLoading && specieData != undefined ?
                            <div className={styles.species}>{specieData.name}</div> :
                            ''
                }
            </div>
            <hr className={styles.carddivider} />
            <div className={styles.statpad}>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_31_13979)">
                        <path d="M7.5 15C10.8137 15 13.5 12.3137 13.5 9C13.5 5.68629 10.8137 3 7.5 3C4.18629 3 1.5 5.68629 1.5 9C1.5 12.3137 4.18629 15 7.5 15Z" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.0641 12.5C15.5611 13.843 15.5771 14.923 15.0001 15.5C13.6191 16.881 9.36612 14.866 5.50012 11C1.63412 7.134 -0.380884 2.881 1.00012 1.5C1.57712 0.923 2.65712 0.939 4.00012 1.436" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_31_13979">
                            <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                        </clipPath>
                    </defs>
                </svg>
                <div className={styles.padtype}>Homeworld</div>
                {homeworldLoading ? <p className={styles.value}>Loading...</p> :
                    !homeworldLoading && homeworldData == undefined ?
                        <div className={styles.value}>N/A</div> :
                        !homeworldLoading && homeworldData != undefined ?
                            <div className={styles.value}>{homeworldData.name}</div>
                            : ''
                }
            </div>
            {!isEmpty(vehicleQueries) && !isLoading ?
                vehicleQueries.map((vehicle, index) => {
                    return (
                        <div key={index} className={styles.statpad}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_31_10650)">
                                    <path d="M5 13H3.5V9.5C3.5 7.015 5.515 5 8 5C10.485 5 12.5 7.015 12.5 9.5V13H11" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.5 3H6" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.5 3H10" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 13C5 12.172 5.672 11.5 6.5 11.5L9.5 11.5C10.328 11.5 11 12.172 11 13C11 13.828 10.328 14.5 9.5 14.5L6.5 14.5C5.672 14.5 5 13.828 5 13Z" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 5C9.10457 5 10 4.10457 10 3C10 1.89543 9.10457 1 8 1C6.89543 1 6 1.89543 6 3C6 4.10457 6.89543 5 8 5Z" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_31_10650">
                                        <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={styles.padtype}>Vehicles</div>
                            <div className={styles.value}>{vehicle?.data?.name}</div>
                        </div>
                    )
                })
                : ''}
            {!isEmpty(starshipQueries) && !isLoading ?
                starshipQueries.map((starship, index) => {
                    return (
                        <div key={index} className={styles.statpad}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_31_7343)">
                                    <path d="M10.084 2.341L14.143 6.4" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.49188 3.22399C6.49788 2.36499 4.09688 2.74999 2.46788 4.37899C2.13388 4.71299 1.85888 5.08199 1.62988 5.46999L3.96988 7.80999" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13.2659 7.97301C14.1459 9.97401 13.7609 12.393 12.1219 14.032C11.7879 14.366 11.4189 14.641 11.0299 14.871L8.67993 12.521" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.81193 13.549L2.95093 9.688C2.95093 9.688 6.24893 1.483 15.4999 1C14.9769 10.211 6.81193 13.549 6.81193 13.549Z" stroke="#3B3B3B" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <mask id="path-5-inside-1_31_7343" fill="white">
                                        <path d="M3.914 15.414C3.133 16.195 0 16.5 0 16.5C0 16.5 0.305 13.367 1.086 12.586C1.867 11.805 3.133 11.805 3.914 12.586C4.695 13.367 4.695 14.633 3.914 15.414Z" />
                                    </mask>
                                    <path d="M0 16.5L-0.995295 16.4031L-1.11309 17.6131L0.0968929 17.4953L0 16.5ZM3.20689 14.7069C3.20832 14.7055 3.17139 14.7401 3.06168 14.7969C2.95775 14.8508 2.81977 14.9085 2.6485 14.9673C2.3048 15.0852 1.88877 15.1862 1.47047 15.2688C1.05634 15.3505 0.661899 15.4099 0.369547 15.4489C0.223984 15.4683 0.105194 15.4825 0.0237216 15.4917C-0.0169829 15.4963 -0.0482793 15.4997 -0.0688432 15.5018C-0.0791225 15.5029 -0.0867112 15.5037 -0.0914436 15.5042C-0.0938095 15.5044 -0.0954605 15.5046 -0.0963759 15.5046C-0.0968336 15.5047 -0.0971072 15.5047 -0.0971943 15.5047C-0.0972378 15.5047 -0.0972347 15.5047 -0.0971845 15.5047C-0.0971596 15.5047 -0.0970865 15.5047 -0.0970741 15.5047C-0.0969894 15.5047 -0.0968929 15.5047 0 16.5C0.0968929 17.4953 0.0970133 17.4953 0.0971457 17.4953C0.0972058 17.4953 0.0973505 17.4952 0.0974707 17.4952C0.0977114 17.4952 0.0980001 17.4952 0.0983364 17.4951C0.099009 17.4951 0.0998722 17.495 0.100923 17.4949C0.103026 17.4947 0.10588 17.4944 0.109466 17.494C0.116637 17.4933 0.126736 17.4923 0.139595 17.4909C0.165306 17.4882 0.202082 17.4843 0.248571 17.479C0.341486 17.4685 0.473563 17.4527 0.633921 17.4314C0.953413 17.3888 1.39103 17.3231 1.85778 17.2309C2.32036 17.1396 2.83402 17.018 3.29741 16.8591C3.72365 16.7129 4.25418 16.488 4.62111 16.1211L3.20689 14.7069ZM0 16.5C0.995295 16.5969 0.995285 16.597 0.995277 16.5971C0.995276 16.5971 0.995269 16.5972 0.995266 16.5972C0.995261 16.5972 0.995261 16.5972 0.995265 16.5972C0.995274 16.5971 0.995301 16.5968 0.995346 16.5964C0.995437 16.5955 0.995602 16.5938 0.99584 16.5914C0.996318 16.5867 0.997093 16.5791 0.99817 16.5688C1.00033 16.5483 1.00369 16.517 1.00829 16.4763C1.01751 16.3948 1.03167 16.276 1.05108 16.1304C1.09007 15.8381 1.14945 15.4437 1.2312 15.0295C1.31376 14.6112 1.41483 14.1952 1.53273 13.8515C1.59148 13.6802 1.64924 13.5422 1.70307 13.4383C1.75989 13.3286 1.79453 13.2917 1.79311 13.2931L0.378893 11.8789C0.0119639 12.2458 -0.212866 12.7763 -0.359073 13.2026C-0.518022 13.666 -0.639637 14.1796 -0.730945 14.6422C-0.823076 15.109 -0.888759 15.5466 -0.931365 15.8661C-0.95275 16.0264 -0.968517 16.1585 -0.979029 16.2514C-0.984289 16.2979 -0.988244 16.3347 -0.990938 16.3604C-0.992286 16.3733 -0.993319 16.3834 -0.994043 16.3905C-0.994405 16.3941 -0.99469 16.397 -0.994898 16.3991C-0.995002 16.4001 -0.995088 16.401 -0.995154 16.4017C-0.995187 16.402 -0.995215 16.4023 -0.995238 16.4025C-0.99525 16.4026 -0.995264 16.4028 -0.99527 16.4028C-0.995283 16.403 -0.995295 16.4031 0 16.5ZM1.79311 13.2931C2.18358 12.9026 2.81642 12.9026 3.20689 13.2931L4.62111 11.8789C3.44958 10.7074 1.55042 10.7074 0.378893 11.8789L1.79311 13.2931ZM3.20689 13.2931C3.59737 13.6836 3.59737 14.3164 3.20689 14.7069L4.62111 16.1211C5.79263 14.9496 5.79263 13.0504 4.62111 11.8789L3.20689 13.2931Z" fill="#3B3B3B" mask="url(#path-5-inside-1_31_7343)" />
                                    <path d="M9 8.5C9.55228 8.5 10 8.05228 10 7.5C10 6.94772 9.55228 6.5 9 6.5C8.44772 6.5 8 6.94772 8 7.5C8 8.05228 8.44772 8.5 9 8.5Z" fill="#3B3B3B" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_31_7343">
                                        <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={styles.padtype}>Starships</div>
                            <div className={styles.value}>{starship?.data?.name}</div>
                        </div>
                    )
                })
                : ''}

        </div>
    )

}

export default Card;