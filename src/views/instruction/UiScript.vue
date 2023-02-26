<template>
    <pretty-script :ident="3 * 4" :start-from-line="1" :end-on-line="1">
        <span><!-- 
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
                }

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
        --></span>
    </pretty-script>
</template>

<script lang="ts" setup>
import PrettyScript from './PrettyScript.vue';
</script>