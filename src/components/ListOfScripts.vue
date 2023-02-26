<template>
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
            <a href="#" class="default-link" @click.prevent="visibleCode = !visibleCode">
                {{ visibleCode ? `hide script` : `show script` }}
            </a>
        </div>

        <div v-show="visibleCode" class="scripts-tabs">
            <div class="scripts-tabs-nav">
                <template v-for="tab in tabs">
                    <div :class="[activeTab === tab ? 'active-tab' : '', 'nav-item']" @click="activeTab = tab">
                        {{ tab }}
                    </div>
                </template>

                <div class="empty-space">
                    <div style="display: flex; justify-content: flex-end; align-items: center; height: 100%;">
                        <label style="cursor: pointer;" onselectstart="return false" mousedown="return false">
                            <input type="checkbox" v-model="expanded">

                            expand
                        </label>
                    </div>
                </div>
            </div>

            <div :class="[expanded ? 'script-container-expand' : '', 'script-container']">
                <full-script v-show="activeTab === Tabs.FullCode" ref="fullCodeComponent" />

                <extract-games-script v-show="activeTab === Tabs.ExtractingGamesCode" />
        
                <main-script v-show="activeTab === Tabs.MainFeatureCode" />

                <ui-script v-show="activeTab === Tabs.UiPartCode" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type PrettyScriptInterface from '../views/instruction/PrettyScript';
import { inject, ref } from 'vue';
import type Swal from 'sweetalert2/dist/sweetalert2.js';
import ExtractGamesScript from '@/views/instruction/ExtractGamesScript.vue';
import MainScript from '@/views/instruction/MainScript.vue';
import UiScript from '@/views/instruction/UiScript.vue';
import FullScript from '@/views/instruction/FullScript.vue';

const swal = inject('$swal') as typeof Swal.fire;
const visibleCode = ref(false);

enum Tabs {
    FullCode = `full code`,
    ExtractingGamesCode = `extracting games code`,
    MainFeatureCode = `entry point + main feature`,
    UiPartCode = `UI part`,
}

const tabs = [Tabs.FullCode, Tabs.ExtractingGamesCode, Tabs.MainFeatureCode, Tabs.UiPartCode];
const activeTab = ref<string>(tabs[0]);
const fullCodeComponent = ref<PrettyScriptInterface>();
const expanded = ref(true);

defineExpose({
    copyMainScript(): void {
        let code = fullCodeComponent.value?.getCode() ?? ``;
        code = code.split(`\n`).map(part => part.trim()).join(``);

        window.navigator.clipboard.writeText(code);

        swal({
            title: 'Copied to clipboard',
            toast: true,
            showConfirmButton: false,
            position: 'top-right',
            icon: `success`,
            width: 300,
            timer: 3000
        });
    },
});
</script>

<style scoped>
.scripts-tabs-nav {
    display: flex;
}

.scripts-tabs-nav > .nav-item {
    padding: 12px 8px;
    font-size: 16px;
    width: 200px;
    border: 1px solid var(--secondary);
    border-left: none;
    color: var(--dark);
    cursor: pointer;
    flex-grow: 1;
}
.scripts-tabs-nav > .nav-item:hover {
    background-color: var(--light-secondary);
}
.scripts-tabs-nav > .nav-item:first-child {
    border-left: 1px solid var(--secondary);
}
.scripts-tabs-nav > .nav-item.active-tab {
    border-bottom: none;
    background-color: white;
    cursor: default;
}
.scripts-tabs-nav > .empty-space {
    flex-grow: 100;
    border-bottom: 1px solid var(--secondary);
}

.script-container {
    margin-top: 0;
    border: 1px solid var(--secondary);
    border-top: none;
    max-height: 400px;
    overflow-y: scroll;
    background-color: var(--light-secondary);
}
.script-container.script-container-expand {
    max-height: none;
    overflow-y: auto;
}

.script-container >>> pre > code {
    overflow-x: initial;
    background-color: var(--light-secondary);
}
</style>