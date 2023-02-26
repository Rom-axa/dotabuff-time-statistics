<template>
    <pretty-script :ident="3 * 4" :start-from-line="1" :end-on-line="1">
        <span><!-- 
            const SCRIPT_TEMPLATE = `{{ script }}`;
            
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
        --></span>
    </pretty-script>
</template>

<script lang="ts" setup>
import PrettyScript from './PrettyScript.vue';
</script>