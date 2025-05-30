package tavindev.infra.http.controllers;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.HeaderParam;
import org.jvnet.hk2.annotations.Service;
import tavindev.core.entities.User;
import tavindev.core.entities.AccountStatus;
import tavindev.core.entities.UserRole;
import tavindev.core.services.UserService;
import tavindev.infra.dto.*;
import tavindev.infra.dto.changeAccountState.ChangeAccountStateDTO;
import tavindev.infra.dto.changeAccountState.ChangeAccountStateResponseDTO;
import tavindev.infra.dto.removeUser.RemoveUserAccountDTO;
import tavindev.infra.dto.removeUser.RemoveUserAccountResponseDTO;
import tavindev.infra.dto.changeAttributes.ChangeAttributesDTO;
import tavindev.infra.dto.changeAttributes.ChangeAttributesResponseDTO;
import tavindev.infra.dto.changePassword.ChangePasswordDTO;
import tavindev.infra.dto.changePassword.ChangePasswordResponseDTO;
import tavindev.infra.dto.changeRole.ChangeRoleDTO;
import tavindev.infra.dto.changeRole.ChangeRoleResponseDTO;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
public class UserController {
    @Inject
    private UserService userService;

    private String orNotDefined(Optional<String> field) {
        return field.orElse("NOT DEFINED");
    }

    @POST
    @Path("/change-role")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeRole(
        @HeaderParam("Authorization") String authHeader,
        @Valid ChangeRoleDTO request
    ) {
        String token = authHeader.replace("Bearer ", "");

        userService.changeRole(token, request.username(), UserRole.valueOf(request.novo_role()));

        return Response.ok(ChangeRoleResponseDTO.success(request.username(), request.novo_role())).build();
    }

    @POST
    @Path("/change-account-state")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeAccountState(
        @HeaderParam("Authorization") String authHeader,
        @Valid ChangeAccountStateDTO request
    ) {
        String token = authHeader.replace("Bearer ", "");

        userService.changeAccountState(token, request.username(), AccountStatus.valueOf(request.novo_estado()));

        return Response.ok(ChangeAccountStateResponseDTO.success(request.username(), request.novo_estado())).build();
    }

    @POST
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeUserAccount(
        @HeaderParam("Authorization") String authHeader,
        @Valid RemoveUserAccountDTO request
    ) {
        String token = authHeader.replace("Bearer ", "");

        userService.removeAccount(token, request.identificador());

        return Response.ok(RemoveUserAccountResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/all")
    public Response listUsers(@HeaderParam("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        
        List<User> users = userService.listUsers(token);
        
        List<UserDTO> userDTOs = users.stream()
            .map(UserMapper::toDTO)
            .collect(Collectors.toList());
            
        return Response.ok(userDTOs).build();
    }

    @POST
    @Path("/change-attributes")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changeAttributes(
        @HeaderParam("Authorization") String authHeader,
        @Valid ChangeAttributesDTO request
    ) {
        String token = authHeader.replace("Bearer ", "");

        userService.changeAttributes(token, request.identificador(), request.atributos());

        return Response.ok(ChangeAttributesResponseDTO.success(request.identificador())).build();
    }

    @POST
    @Path("/change-password")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changePassword(
        @HeaderParam("Authorization") String authHeader,
        @Valid ChangePasswordDTO request
    ) {
        String token = authHeader.replace("Bearer ", "");

        if (request.isPasswordNotMatch()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ChangePasswordResponseDTO("As senhas não coincidem."))
                .build();
        }

        userService.changePassword(token, request.senha_atual(), request.nova_senha());

        return Response.ok(ChangePasswordResponseDTO.success()).build();
    }
}
