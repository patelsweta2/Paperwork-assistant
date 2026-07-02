import { useState } from 'react'
import type { Placeholder } from '../type/document';

interface Props {
    placeholders: Placeholder[];
}

const PlaceholderTable = ({
    placeholders,
}: Props) => {

    return (

        <div className="mt-8">

            <h2 className="text-xl font-semibold mb-4">
                Detected Placeholders
            </h2>

            <table className="w-full border border-gray-300">

                <thead>

                    <tr className="bg-gray-100">

                        <th className="border p-2 text-left">
                            Placeholder
                        </th>

                        <th className="border p-2 text-left">
                            Pattern
                        </th>

                        <th className="border p-2 text-center">
                            Count
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        placeholders.map((placeholder) => (

                            <tr
                                key={placeholder.id}
                            >

                                <td className="border p-2">
                                    {placeholder.name}
                                </td>

                                <td className="border p-2">
                                    {placeholder.type}
                                </td>

                                <td className="border p-2 text-center">
                                    {placeholder.occurrences}
                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>


    );

}

export default PlaceholderTable;