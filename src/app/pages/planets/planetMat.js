import React from 'react';
import { capitalize } from 'lodash'


export default ({ resource }) => {

    const resourceAmount = ((resource.type === "atmospheric") ? resource.factor * 60 : resource.factor * 70);

    return (
        <div className={'p-2 rounded-md bg-gray-400 dark:bg-gray-800'}>
            <h4>{capitalize(resource.material.ticker)} - { capitalize(resource.material.name) } - Daily Amount: { resourceAmount.toFixed(2) } </h4>
        </div>
    )
}