/**
 * @oas [post] /admin/customers/{id}
 * operationId: PostCustomersId
 * summary: Update a Customer
 * description: Update a customer's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customers/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema: {}
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
 *           - email
 *           - company_name
 *           - first_name
 *           - last_name
 *           - phone
 *         properties:
 *           email:
 *             type: string
 *             title: email
 *             description: The customer's email.
 *             format: email
 *           company_name:
 *             type: string
 *             title: company_name
 *             description: The customer's company name.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The customer's last name.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The customer's phone.
 * 
*/

