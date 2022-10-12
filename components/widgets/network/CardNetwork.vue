<template>
    <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-3">
                <img :src="network.image.large" class="img-fluid rounded-start" :alt="network.name">
            </div>
            <div class="col-md-9">
                <div class="card-body">
                    <h5 class="card-title">{{ network.name }}</h5>
                    <span v-if="network.is_private" class="badge bg-danger">Privé</span>
                    <span v-else class="badge bg-success">Public</span>
                    {{network.type_label}}
                    <p class="card-text">{{ network.summary }}</p>
                    <p class="card-text"><small class="text-muted">{{ network.users.length }} Inscrits</small></p>
                    <network-access
                        :network="network"
                    ></network-access>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CardNetwork',
        props: {
            network: {
                type: Object,
                required: true
            }
        },
        components: {
           NetworkAccess: () => import('vuejs-socializer/components/widgets/network/NetworkAccessBtn'),
        },
    }
</script>