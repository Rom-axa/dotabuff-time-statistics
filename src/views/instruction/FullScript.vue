<template>
    <pretty-script :ident="3 * 4" :start-from-line="1" :end-on-line="1" ref="prettyScript">
        <span><!-- 
            (() => {
                const SCRIPT_TEMPLATE = `
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
                `;
                
                const downloadObjectAsJson = (exportObj, exportName) => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href",     dataStr);
                    downloadAnchorNode.setAttribute("download", exportName + ".json");
                    document.body.appendChild(downloadAnchorNode); /* required for firefox */
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                };

                /*type Page = {current: number, next: {page: number, url: string} | null, last: {page: number, url: string} | null}*/;
                
                const extractUserGames = (
                    userId,
                    onProcessedPage = (nextPage/*: Page*/, extractedGamesQty/*: number*/) => {},
                    isCancelled = () => false,
                    maxWaitingTime = 240000
                ) => {
                    maxWaitingTime = maxWaitingTime ?? 240000;
                    const token = (Math.random() + 1).toString(36).substring(7);
                
                    return new Promise((resolve, reject) => {
                        let finished = false;
                
                        const result = {
                            time: 0,
                            pages: 0,
                            games: [],
                        };

                        if (isCancelled()) {
                            finished = false;
                            reject(`cancelled`);
                            console.log(`extractUserGames() was cancelled`);
                            return;
                        }
                        
                        setTimeout(() => {
                            if (!finished) {
                                finished = true;
                                reject(result);
                            }
                        }, maxWaitingTime);
                
                        const startTime = new Date();
                
                        window.addEventListener(`message`, event => {
                            console.log(`received message event from`, event?.origin);
                
                            if (event?.origin !== `https://www.dotabuff.com`) {
                                console.log(`Skipped unknown message`, event);
                                return;
                            }
                
                            if (finished) {
                                console.log(`Skipped finished task`, event);
                                event?.source?.close();
                                return;
                            }

                            if (isCancelled()) {
                                finished = false;
                                reject(`cancelled`);
                                console.log(`extractUserGames() was cancelled`);
                                return;
                            }
                    
                            console.log(`Closing child window`);
                            event?.source?.close();
                    
                            console.log(`Extracting event payload`);
                            const { is404, isAccountPrivate, user, games, nextPage, token: windowToken } = event?.data ?? {};

                            if (is404) {
                                finished = true;
                                console.log(`opened page 404`);
                                reject({ is404: true });
                                return;
                            }

                            if (isAccountPrivate) {
                                finished = true;
                                console.log(`account locked`);
                                reject({ isAccountPrivate: true });
                                return;
                            }
                    
                            if (token !== windowToken) {
                                console.log(`Skipped event because invalid token`, event);
                                return;
                            }
                    
                            if ([user, games, nextPage].includes(undefined) || !(games instanceof Array)) {
                                console.log(`Skipped event because invalid payload`, event);
                                return;
                            }
                
                            games.forEach(game => {
                                game.user = user;
                            });
                            result.games.push(...games);
                            result.pages++;
                
                            try {
                                onProcessedPage(nextPage, games.length);
                            } catch(error) {
                            }

                            if (!nextPage?.next) {
                                console.log(`done`, result);
                                finished = true;
                                
                                const endTime = new Date();
                                result.time = +((endTime - startTime) / 1000).toFixed(2);
                
                                resolve(result);
                                return;
                            }
                
                            console.log(`Waite before opening next page`, nextPage.next);
                            setTimeout(() => {
                                console.log(`Opening next page`, nextPage.next);
                                const newWindow = window.open(nextPage.next.url, `extractor`, `width=200,height=50`);
                
                                console.log(`Injecting script to opened page`);
                                console.log(`newWindow`, newWindow);
                                newWindow.onload = function() {
                                    const script = document.createElement(`script`);
                            
                                    script.dataset.secretToken = token;
                                    script.innerHTML = SCRIPT_TEMPLATE;
                            
                                    this.document.body.appendChild(script);
                                };
                
                            }, 0);
                        });

                        console.log(`Start extracting with token`, token);
                        const newWindow = window.open(`https://www.dotabuff.com/players/${userId}/matches`, `extractor`, `width=200,height=50`);
                    
                        console.log(`new window`, newWindow);
                        newWindow.onload = function() {
                            const script = document.createElement(`script`);
                    
                            script.dataset.secretToken = token;
                            script.innerHTML = SCRIPT_TEMPLATE;
                    
                            this.document.body.appendChild(script);
                        };
                    });
                };

                /* ui */
                const layout = `
                <div style="position: fixed; height: 100vh; width: 100vw; top: 0; left: 0; background: #000000a8; z-index: 99999; display: flex; justify-content: center; align-items: center;">
                    <div style="height: 250px; width: 400px; background: white;">
                        <h1 style="color: black; font-size: revert; text-align: center; margin-top: 15px;">
                            Download user matches
                        </h1>

                        <div style="padding: 10px; display: flex; align-items: center; justify-content: space-around;">
                            <input class="search-user-input" type="text" placeholder="Enter user ID" style="width: 60%; background: white; color: black; border: 1px solid gray; box-shadow: none!important; outline: none;">

                            <button class="download-button-input" type="button" style="color: black!important; border: none!important; height: 100%; text-shadow: none; background-image: none;">
                                Download
                            </button>
                        </div>

                        <div class="screen-container" style="margin: 20px; height: 110px; background: lightgray; margin-top: 10px;">
                            <div class="error-message" style="padding-top: 10px; text-align: center;color: red; display: none;"></div>

                            <h3 class="screen-header" style="font-size: 18px; color: black; padding-top: 5px; padding-left: 5px; display: none;"></h3>

                            <p class="screen-message" style="margin-top: 10px; padding-left: 5px;"></p>
                        </div>
                    </div>
                </div>
                `;

                const $tempNode = document.createElement(`div`);
                $tempNode.innerHTML = layout;

                const $node = $tempNode.children[0];
                const $input = $node.querySelector(`.search-user-input`);
                const $button = $node.querySelector(`.download-button-input`);
                const $screen = $node.querySelector(`.screen-container`);
                const $errorMessage = $screen.querySelector(`.error-message`);
                const $screenHeader = $screen.querySelector(`.screen-header`);
                const $screenMessage = $screen.querySelector(`.screen-message`);

                const disableButton = () => {
                    $button.style.cursor = `default`;
                    $button.style.opacity = `0.5`;
                    $button.setAttribute(`disabled`, `disabled`);
                };
                const enableButton = () => {
                    $button.style.cursor = `pointer`;
                    $button.style.opacity = `1`;
                    $button.removeAttribute(`disabled`);
                };
                const disableInput = () => $input.setAttribute(`disabled`, `disabled`);
                const enableInput = () => $input.removeAttribute(`disabled`);
                const showErrorMessage = message => {
                    $errorMessage.innerText = message;
                    $errorMessage.style.display = `block`;
                    $screenHeader.style.display = `none`;
                    $screenMessage.style.display = `none`;
                };
                const showScreenMessage = (header, message = ``) => {
                    $screenHeader.innerText = header;
                    $screenMessage.innerText = message;
                    $screenHeader.style.display = `block`;
                    $screenMessage.style.display = `block`;
                    $errorMessage.style.display = `none`;
                };

                let isCancelled = false;

                $node.onclick = event => {
                    if (event?.target !== $node) {
                        return;
                    }

                    isCancelled = true;
                    $node.remove();
                };

                $input.addEventListener(`input`, () => {
                    const isButtonDisabled = $button.getAttribute(`disabled`) !== null;
                    const isEmptyInput = $input.value.trim().length < 1;

                    if (isEmptyInput && !isButtonDisabled) {
                        disableButton();
                    } else if (!isEmptyInput && isButtonDisabled) {
                        enableButton();
                    }
                });

                $input.addEventListener(`keydown`, event => {
                    if (event?.key === `Enter`) {
                        $button.click();
                    }
                });

                $button.onclick = () => {
                    const userId = parseInt($input.value);

                    /* is NaN */
                    if (userId !== userId) {
                        showErrorMessage(`invalid user id`);
                        return;
                    }

                    disableButton();
                    disableInput();

                    showScreenMessage(`Extracting user (${userId}) games...`);

                    let totalGames = 0;

                    const onProcessedPage = (nextPage/*: Page*/, extractedGamesQty/*: number*/) => {
                        totalGames += extractedGamesQty;

                        showScreenMessage(
                            `Extracting user (${userId}) games...`,
                            `page ${nextPage?.current ?? 0}/${nextPage?.last?.page ?? nextPage?.current ?? 0} games ${totalGames}`
                        );
                    };

                    extractUserGames(userId, onProcessedPage, () => isCancelled)
                        .then(result => {
                            if (result.games.length > 0) {
                                showScreenMessage(`User games were successfully extracted`);

                                downloadObjectAsJson(result.games, `user-games-${result.games[0].user.name}`);
                            } else {
                                showErrorMessage(`No games were extracted`);
                            }
                        })
                        .catch(error => {
                            if (error.is404) {
                                showErrorMessage(`user with id ${userId} not found`);
                            } else if (error.isAccountPrivate) {
                                showErrorMessage(`user account hidden`);
                            } else if (error !== `cancelled`) {
                                showErrorMessage(`unknown error`, error);
                            }
                        })
                        .finally(() => {
                            enableButton();
                            enableInput();
                        });
                };

                disableButton();
                document.body.appendChild($node);
            })();
        --></span>
    </pretty-script>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PrettyScript from './PrettyScript.vue';
import type PrettyScriptInterface from './PrettyScript';

const prettyScript = ref<PrettyScriptInterface>();

defineExpose({
    getCode(): string {
        return prettyScript.value?.getCode() ?? ``;
    },
});
</script>