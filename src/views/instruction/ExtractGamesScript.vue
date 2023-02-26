<template>
    <pretty-script :ident="3 * 4" :start-from-line="2" :end-on-line="1">
        <span><!-- 
            console.log('Script injected');
            const token = document.currentScript?.dataset?.secretToken ?? null;

            (async () => {
                await (new Promise(resolve => setTimeout(resolve, 200)));
                const is404 = () => document.querySelector('h2#status') !== null;
                const isAccountPrivate = () => document.querySelector('.page-show > .intro > h1 > .fa.fa-lock') !== null;
                const getUser = () => ({
                    id: (document.querySelector('.image-player')?.parentElement?.getAttribute('href')?.split('/')?.reverse() ?? [])[0],
                    name: document.querySelector('.header-content-container .header-content-title').innerText.replace('\\n', '').replace(/matches/i, ''),
                });
            
                const getGamesNodes = () => Array.from(document.querySelectorAll('.content-inner article table tbody tr'));
                    
                const getGameFromNode = $node => ({
                    id: $node.querySelectorAll("td")[1].querySelector("a").getAttribute("href").split("/")[2],
                    isInactive: $node.classList.contains("inactive"),
                    character: $node.querySelectorAll("td")[1].querySelector("a").innerText,
                    rank:  $node.querySelectorAll("td")[1].querySelector("div.subtext").innerText,
                    trueSight: $node.querySelectorAll("td")[2].children.length > 0,
                    result: $node.querySelectorAll("td")[3].querySelector("a").innerText,
                    datetime: $node.querySelectorAll("td")[3].querySelector("time").getAttribute("datetime"),
                    date: (new Date($node.querySelectorAll("td")[3].querySelector("time").getAttribute("datetime"))).toISOString().slice(0, 10),
                    ...(
                        ((info) => ({ type: info[0], mode: info[info.length - 1] }))
                        (
                            (($typeElement) => ((childTexts) => ([
                                ((nodeText) => childTexts.reduce((text, childText) => text.replace(childText, ""),nodeText))($typeElement.innerText),
                                    ...childTexts
                                ]))(Array.from($typeElement.children)
                                    .map(child => child.innerText))
                                    .map(val => val.trim())
                                    .filter(val => val !== '')
                            )($node.querySelectorAll("td")[4])
                        )
                    ),
                    isParty: ($node.querySelectorAll("td")[4].querySelector('[rel="tooltip"]')?.getAttribute("oldtitle")?.match(/^Party Queue/) ?? null) !== null,
                    gameDurationTime: $node.querySelectorAll("td")[5].innerText,
                    gameDurationSeconds: (
                        (parts, sum) => sum(...parts.reverse())
                    )($node.querySelectorAll("td")[5].innerText.split(":").map(val => parseInt(val)), (seconds, minutes = 0, hours = 0) => seconds + (minutes * 60) + (hours * 3600)),
                    kda: $node.querySelectorAll("td")[6].querySelector(".kda-record")?.innerText?.split("/")?.map(val => parseInt(val)) ?? [0, 0, 0],
                });
            
                const getPaginationPanel = () => {            
                    const $panel = document.querySelector('.content-inner .pagination');
                    const current = parseInt($panel.querySelector('.page.current').innerText);
                    const $next = $panel.querySelector('.page > a[rel="next"]') ?? null;
                    const next = $next === null ? null : { page: parseInt($next?.innerText), url: $next?.getAttribute('href') };
                    
                    const $last = $panel.querySelector('.last a');
                    const lastPageUrl = $last?.getAttribute('href') ?? null;
                    let lastPageNumber = null;
                    /*let lastPageNumber = (lastPageUrl?.match(/(?<=&page=)\d+/) ?? [])[0] ?? null;*/
                    /*lastPageNumber = lastPageNumber instanceof Array ? lastPageNumber = parseInt(lastPageNumber[0]) : null;*/

                    try {
                        lastPageNumber = (new URL('localhost:80' + lastPageUrl)).searchParams.get('page');
                        lastPageNumber = parseInt(lastPageNumber);
                    } catch(error) {
                    }

                    const last = lastPageUrl === null ? null : { page: lastPageNumber, url: lastPageUrl };
                    
                    return { current, next, last };
                };
            
                const reportToParentWindow = () => {
                    if (is404()) {
                        window?.opener?.postMessage({
                            is404: true,
                        });
                        return;
                    }

                    if (isAccountPrivate()) {
                        window?.opener?.postMessage({
                            isAccountPrivate: true,
                        });
                        return;
                    }

                    window?.opener?.postMessage({
                        token,
                        user: getUser(),
                        games: getGamesNodes().map(getGameFromNode),
                        nextPage: getPaginationPanel(),
                    });
                };
            
                reportToParentWindow();
            })();
        --></span>
    </pretty-script>
</template>

<script lang="ts" setup>
import PrettyScript from './PrettyScript.vue';
</script>