/**
 * @oas [post] /admin/collections
 * operationId: PostCollections
 * summary: Create Collection
 * description: Create a collection.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/collections' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Collections
 * responses:
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - title
 *           - handle
 *           - metadata
 *         properties:
 *           title:
 *             type: string
 *             title: title
 *             description: The collection's title.
 *           handle:
 *             type: string
 *             title: handle
 *             description: The collection's handle.
 *           metadata:
 *             type: object
 *             description: The collection's metadata.
 *             properties: {}
 * 
*/

