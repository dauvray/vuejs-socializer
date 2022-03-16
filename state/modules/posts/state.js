import { paginatedTemplate } from 'vuejs-eblogger/components/helpers/utils'

export default () => {
    return {
        paginatedPosts: {...paginatedTemplate()},
    }
}
